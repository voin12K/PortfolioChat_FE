import React, { useEffect, useState } from "react";
import axios from "axios";
import "./search.scss";
import { useNavigate } from "react-router-dom";
import { ReactComponent as SearchIcon } from "../../../../assets/icons/search.svg";

export default function Search() {
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    
    const navigate = useNavigate();
  
    // Получаем ID текущего пользователя из токена
    const getMyIdFromToken = () => {
      const token = localStorage.getItem("token");
      if (!token) return null;
      
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id;
      } catch {
        return null;
      }
    };
  
    useEffect(() => {
      if (!search) return;
    
      const getSearchResults = async () => {
        setLoading(true);
        try {
          const myId = getMyIdFromToken();
    
          const response = await axios.get("http://localhost:5000/api/users/users", {
            params: { username: search },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          });
    
          // Убираем текущего пользователя из результатов
          const filteredResults = response.data.filter(user => user._id !== myId);
    
          setResults(filteredResults);
          setError(null);
        } catch (err) {
          console.error(err);
          setError("Ошибка при выполнении поиска");
        } finally {
          setLoading(false);
        }
      };
    
      const debounceTimeout = setTimeout(getSearchResults, 500);
      return () => clearTimeout(debounceTimeout);
    }, [search]);
    
  
    const handleUserClick = async (userId) => {
      try {
        const token = localStorage.getItem("token")?.trim();
        if (!token) {
          navigate('/login');
          return;
        }
    
        const myId = getMyIdFromToken();
        if (!myId) {
          navigate('/login');
          return;
        }
    
        if (myId === userId) {
          alert('Нельзя создать чат с самим собой!');
          return;
        }
    
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };
    
        // Получаем все чаты пользователя
        const { data: chats = [] } = await axios.get('http://localhost:5000/api/chats/my', config);
    
        // Проверка существующего приватного чата
        const existingChat = chats.find(chat =>
          !chat.isGroup &&
          Array.isArray(chat.users) &&
          chat.users.length === 2 &&
          chat.users.some(u => u._id === userId)
        );
    
        if (existingChat) {
          navigate(`/chat/${existingChat._id}`);
          return;
        }
    
        // Создаём новый приватный чат
        const { data: newChat } = await axios.post(
          'http://localhost:5000/api/chats/private',
          { userId1: myId, userId2: userId },
          config
        );
    
        navigate(`/chat/${newChat._id}`);
    
      } catch (error) {
        console.error("Ошибка:", error.response?.data || error.message);
    
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate('/login');
        } else {
          alert(error.response?.data?.message || 'Ошибка при создании чата');
        }
      }
    };
    

    return (
        <div className="Search">
            <SearchIcon />
            <input
                className="Search-input"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setShowResults(true)}
            />
            {loading && <div className="Search-loading">Загрузка...</div>}
            {error && <div className="Search-error">{error}</div>}

            {showResults && (
                <div className="Search-dropdown">
                    <button className="Search-close" onClick={() => setShowResults(false)}>Закрыть</button>
                    <ul className="Search-results">
                        {results.length > 0 ? (
                            results.map((user) => (
                                <li 
                                    key={user._id} 
                                    onClick={() => handleUserClick(user._id)}
                                    className="Search-result-item"
                                >
                                    {user.name}
                                </li>
                            ))
                        ) : (
                            <li>Нет данных</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}