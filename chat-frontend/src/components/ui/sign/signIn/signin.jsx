import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import "./signin.scss";
import { ReactComponent as GoogleIcon } from "../../../../assets/icons/Google.svg";
import { Toaster, toast } from "sonner";

export default function SignIn({ switchToSignUp }) {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { login } = useAuth();

    const validate = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(credentials.email)) {
            newErrors.email = "Please enter a valid email address";
        }
        if (credentials.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters long";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
        setErrors({ ...errors, [name]: "" }); 
    };

const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
        const response = await fetch("https://portfoliochat-be.onrender.com/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data.errors?.password || 
                                 data.errors?.email || 
                                 data.message || 
                                 "Incorrect email or password";
            toast.error(errorMessage);
            return;
        }

        if (data.user && data.user._id) {
            localStorage.setItem("userId", data.user._id);
        } else {
            console.warn("userId is missing in login response", data);
        }

        login(data.token);
        navigate("/");

    } catch (error) {
        console.error("Error logging in:", error);
        toast.error(error.message || "Error connecting to server");
    }
};
 
    return (
        <div className="Login">
            <Toaster position="top-center" richColors />
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
                    {errors.email && <span className="Login-error">{errors.email}</span>}
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
                    {errors.password && <span className="Login-error">{errors.password}</span>}
                </div>
                <div className="Login-buttall">
                    <button type="submit" className="Login-buttall-buttlog">
                        Log In
                    </button>
                </div>
                <p className="Login-logup">
                    Don’t have an account?{" "}
                    <span className="Login-logup-link" onClick={switchToSignUp}>
                        Sign Up
                    </span>
                </p>
            </form>
        </div>
    );
}
