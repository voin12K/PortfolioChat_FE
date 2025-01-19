import React, { useEffect, useState } from "react";
import axios from "axios";
import "./search.scss";

import { ReactComponent as SearchIcon } from "../../../../assets/icons/search.svg";

export default function Search() {
    const [search, setSearch] = useState(""); 
    const [results, setResults] = useState([]); 
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!search) return;

        const getSearch = async () => {
            setLoading(true);
            try {
                const response = await axios.get("http://localhost:5000/api/users/users", {
                    params: { username: search },
                });
                console.log(response.data);
                setResults(response.data);
                setError(null);
            } catch (err) {
                console.error(err);
                setError("Ошибка при выполнении поиска");
            } finally {
                setLoading(false);
            }
        };

        const debounceTimeout = setTimeout(getSearch, 500);
        return () => clearTimeout(debounceTimeout);
    }, [search]);

    return (
        <div className="Search">
            <SearchIcon />
            <input
                className="Search-input"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            {loading && <div className="Search-loading">Загрузка...</div>}
            {error && <div className="Search-error">{error}</div>}
            <ul className="Search-results">
                {results.map((user) => (
                    <li key={user.username}>{user.name}</li>
                ))}
            </ul>
        </div>
    );
}




