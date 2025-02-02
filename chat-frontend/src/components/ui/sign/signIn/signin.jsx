import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import "./signin.scss";
import { ReactComponent as GoogleIcon } from "../../../../assets/icons/Google.svg";

export default function SignIn({ switchToSignUp }) {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            });
            const data = await response.json();
            if (response.ok) {
                login(data.token);
                navigate("/");
            } else {
                setMessage(data.message || "Login failed.");
            }
        } catch (error) {
            setMessage("Error connecting to server.");
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
                    <button type="button" className="Login-buttall-buttlog-withG">
                        Log In with <GoogleIcon />
                    </button>
                </div>
                <p className="Login-logup">
                    Don’t have an account?{" "}
                    <span className="Login-logup-link" onClick={switchToSignUp}>
                        Sign Up
                    </span>
                </p>
            </form>
            <p>{message}</p>
        </div>
    );
}
