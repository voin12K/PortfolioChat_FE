import React, { useState } from "react";
import "./signin.scss";

export default function SignIn() {
    const [credentials, setCredentials] = useState({ email: "test@test.com", password: "1234" });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(credentials);
        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage("Вход успешен!");
                localStorage.setItem("token", data.token);
            } else {
                console.log(data);
                setMessage(data.message || "Ошибка входа.");
            }
        } catch (error) {
            setMessage("Ошибка соединения с сервером.");
        }
    };
    

    return (
        <div className="Login">
            <h1 className="Login-title">Sign In</h1>
            <form className="Login-form" onSubmit={handleSubmit}>
                <div className="Login-emailall">
                    <p className="Login-email">E-mail</p>
                    <input
                        type="email"
                        className="Login-email-input"
                        name="email"
                        value={credentials.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="Login-passwordall">
                    <p className="Login-password">Password</p>
                    <input
                        type="password"
                        className="Login-password-input"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                    />
                </div>
                <p className="Login-forgotpass">Forgot Password?</p>
                <div className="Login-buttall">
                    <button type="submit" className="Login-buttall-buttlog">
                        Log In
                    </button>
                    <button type="submit" className="Login-buttall-buttlog-withG">
                        Log In win G
                    </button>
                </div>
                <p className="Login-logup">
                    Don’t have an account? <a href="#" className="Login-logup-link">Log Up</a>
                </p>
            </form>
            <p>{message}</p>
        </div>
    );
}
