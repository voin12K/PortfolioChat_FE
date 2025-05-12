import React, { useState } from "react";
import { motion } from "framer-motion";
import "./auth.scss";
import SignIn from "../ui/sign/signIn/signin";
import SignUp from "../ui/sign/singUp/signup";

export default function Auth() {
    const [isSignIn, setIsSignIn] = useState(true);

    const toggleForm = () => {
        setIsSignIn((prev) => !prev);
    };

    return (
        <div className="Auth-all">        
            <div className="Auth">
                <motion.div
                    className="auth-form-container"
                >
                    {isSignIn ? (
                        <SignIn switchToSignUp={toggleForm} />
                    ) : (
                        <SignUp switchToSignIn={toggleForm} />
                    )}
                </motion.div>
            </div>
        </div>
    );
}
