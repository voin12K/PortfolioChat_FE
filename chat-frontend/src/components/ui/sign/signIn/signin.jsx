import React from "react";
import "./signin.scss";

export default function SignIn() {
    return (
        <div className="Login">
            <h1 className="Login-title">Sign In</h1>
            <div className="Login-emailall">
                <p className="Login-email">E-mail</p>
                <input type="email" className="Login-email-input" />
            </div>
            <div className="Login-passwordall">
                <p className="Login-password">Password</p>
                <input type="password" className="Login-password-input" />
            </div>
            <p className="Login-forgotpass">Forgot Password?</p>
            <div className="Login-buttall">
                <button className="Login-buttall-buttlog">Log In</button>
                <button className="Login-buttall-buttlog-withG">Log In with G</button>
            </div>
            <p className="Login-logup">
                Don’t have an account? <a href="#" className="Login-logup-link">Log Up</a>
            </p>
        </div>
    );
}
