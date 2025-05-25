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
      if (!search) {
        setResults([]);
        setError(null);
      }
    }, [search]);
    
    useEffect(() => {
      if (!search) return;
    
      const getSearchResults = async () => {
        setLoading(true);
        try {
          const myId = getMyIdFromToken();
    
          const response = await axios.get("https://portfoliochat-be.onrender.com/api/users/users", {
            params: { username: search },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          });
    
          const filteredResults = response.data.filter(user => user._id !== myId);
    
          setResults(filteredResults);
          setError(null);
        } catch (err) {
          console.error(err);
          setError("Error while performing search");
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
          alert('You cant create a chat with yourself');
          return;
        }
    
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };
    
        const { data: chats = [] } = await axios.get('https://portfoliochat-be.onrender.com/api/chats/my', config);
    
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
          alert(error.response?.data?.message || 'Error creating chat');
        }
      }
    };
    

   return (
        <div className="search-wrapper">
            {showResults && (
                <button 
                    className="search-close-btn" 
                    onClick={() => {
                        setShowResults(false);
                        setSearch("");
                    }}
                >
                    ×
                </button>
            )}
            
            <div className={`Search ${showResults ? 'search-active' : ''}`}>
                <SearchIcon />
                <input
                    className="Search-input"
                    placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => setShowResults(true)}
                />
            </div>

            {showResults && (
                <div className="Search-dropdown">
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
                            <li className="no-results">Нет результатов</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}