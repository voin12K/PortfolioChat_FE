import React, { useState } from "react";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import "./signup.scss";
import { ReactComponent as GoogleIcon } from "../../../../assets/icons/Google.svg";

export default function SignUp({ switchToSignIn }) {
    const [formData, setFormData] = useState({ 
        name: "", 
        username: "", 
        email: "", 
        password: "" 
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { login } = useAuth();

    const validate = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }
        if (!formData.username.trim()) {
            newErrors.username = "Username is required";
        }
        if (!emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }
        if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
        const registerResponse = await fetch("https://portfoliochat-be.onrender.com/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const registerData = await registerResponse.json();

        if (!registerResponse.ok) {
            const errorMessage = registerData.errors?.email || 
                               registerData.errors?.password || 
                               registerData.message || 
                               "Registration failed";
            toast.error(errorMessage);
            return;
        }

        toast.success("Registration successful! Logging you in...");

        const loginResponse = await fetch("localhost:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: formData.email,
                password: formData.password
            }),
        });
 
        const loginData = await loginResponse.json();

        if (loginResponse.ok && loginData.token) {
            login(loginData.token);
            

            setTimeout(() => {
                navigate("/");
            }, 1500); 

        } else {
            toast("Please log in manually");
            switchToSignIn();
        }

    } catch (error) {
        console.error("Error:", error);
        toast.error("Operation failed");
    }
};

    return (
        <div className="Reg">
            <Toaster position="top-center" richColors />
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
                    {errors.name && <span className="Reg-error">{errors.name}</span>}
                </div>
                <div className="Reg-usernameall">
                    <p className="Reg-username">Username</p>
                    <input
                        className="Reg-username-input"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    {errors.username && <span className="Reg-error">{errors.username}</span>}
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
                    {errors.email && <span className="Reg-error">{errors.email}</span>}
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
                    {errors.password && <span className="Reg-error">{errors.password}</span>}
                </div>
                <div className="Reg-buttall">
                    <button type="submit" className="Reg-buttall-buttlog">
                        Sign Up
                    </button>
                </div>
                <p className="Reg-login">
                    Have an account?{" "}
                    <span className="Reg-login-link" onClick={switchToSignIn}>
                        Log In
                    </span>
                </p>
            </form>
        </div>
    );
}