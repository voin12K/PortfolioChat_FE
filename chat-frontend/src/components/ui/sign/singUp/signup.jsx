import React from "react";
import "./signup.scss";

export default function SignUp() {
    return (
        <div className="Reg">
            <h1 className="Reg-title">Sign Up</h1>
            <div className="Reg-nameall">
                <p className="Reg-name">Name</p>
                <input className="Reg-name-input" />
            </div>
            <div className="Reg-usernameall">
                <p className="Reg-username">Username</p>
                <input className="Reg-username-input" />
            </div>
            <div className="Reg-emailall">
                <p className="Reg-email">E-mail</p>
                <input type="email" className="Reg-email-input" />
            </div>
            <div className="Reg-passwordall">
                <p className="Reg-password">Password</p>
                <input className="Reg-password-input" />
            </div>
            <p className="Reg-forgotpass">Forgot Password?</p>
            <div className="Reg-buttall">
                <button className="Reg-buttall-buttlog">Log Up</button>
                <button className="Reg-buttall-buttlog-withG">Log Up with G</button>
            </div>
            <p className="Reg-login">
                Have an account? <a href="#" className="Reg-login-link">Log In</a>
            </p>
        </div>
    );
}
