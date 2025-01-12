import React, { useState } from "react";
import "./signup.scss";
import { ReactComponent as GoogleIcon } from "../../../../assets/icons/Google.svg";

export default function SignUp({ switchToSignIn }) {
    const [formData, setFormData] = useState({ name: "", username: "", email: "", password: "" });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage("Registration successful!");
            } else {
                setMessage(data.message || "Registration failed.");
            }
        } catch (error) {
            setMessage("Error connecting to server.");
        }
    };

    return (
        <div className="Reg">
            <h1 className="Reg-title">Sign Up</h1>
            <form className="Reg-form" onSubmit={handleSubmit}>
                <div className="Reg-nameall">
                    <p className="Reg-name">Name</p>
                    <input
                        className="Reg-name-input"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>
                <div className="Reg-usernameall">
                    <p className="Reg-username">Username</p>
                    <input
                        className="Reg-username-input"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </div>
                <div className="Reg-emailall">
                    <p className="Reg-email">E-mail</p>
                    <input
                        type="email"
                        className="Reg-email-input"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="Reg-passwordall">
                    <p className="Reg-password">Password</p>
                    <input
                        type="password"
                        className="Reg-password-input"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
                <p className="Reg-forgotpass">Forgot Password?</p>
                <div className="Reg-buttall">
                    <button type="submit" className="Reg-buttall-buttlog">
                        Sign Up
                    </button>
                    <button type="button" className="Reg-buttall-buttlog-withG">
                        Sign Up with <GoogleIcon />
                    </button>
                </div>
                <p className="Reg-login">
                    Have an account?{" "}
                    <span
                        className="Reg-login-link"
                        onClick={switchToSignIn}
                    >
                        Log In
                    </span>
                </p>
            </form>
            <p>{message}</p>
        </div>
    );
}
