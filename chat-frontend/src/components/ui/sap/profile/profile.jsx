import React, { useRef, useEffect, useState } from "react";
import "./profile.scss";
import { ReactComponent as GoogleIcon } from "../../../../assets/icons/settings.svg";

export default function Profile() {
    const buttonRef = useRef(null);
    const [position, setPosition] = useState({ x: window.innerWidth - 56, y: 16 });
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const button = buttonRef.current;
            if (!button) return;

            const rect = button.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const distanceX = e.clientX - centerX;
            const distanceY = e.clientY - centerY;
            const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

            const newScale = Math.max(0.5, Math.min(1, distance / 200));
            setScale(newScale);

            const threshold = 100;
            if (distance < threshold) {
                let newX = position.x - distanceX * 0.1;
                let newY = position.y - distanceY * 0.1;

                const maxX = window.innerWidth - rect.width;
                const maxY = window.innerHeight - rect.height;

                newX = Math.max(0, Math.min(newX, maxX));
                newY = Math.max(0, Math.min(newY, maxY));

                setPosition({ x: newX, y: newY });
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [position]);

    const teleport = () => {
        const button = buttonRef.current;
        if (!button) return;

        const rect = button.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width;
        const maxY = window.innerHeight - rect.height;

        const newX = Math.random() * maxX;
        const newY = Math.random() * maxY;

        setPosition({ x: newX, y: newY });
    };

    return (
        <div className="profile">
            <button
                ref={buttonRef}
                className="profile__icon-button"
                onClick={teleport}
                style={{
                    position: "fixed",
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    transform: `scale(${scale})`,
                    transition: "transform 0.1s",
                    zIndex: 1000,
                }}
            >
                <GoogleIcon className="profile__icon" />
            </button>
        </div>
    );
}
