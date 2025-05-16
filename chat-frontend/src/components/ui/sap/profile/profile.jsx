import React, { useRef, useEffect, useState } from "react";
import "./profile.scss";
import { ReactComponent as GoogleIcon } from "../../../../assets/icons/settings.svg";

export default function Profile() {
    const buttonRef = useRef(null);
    const [position, setPosition] = useState({ x: window.innerWidth - 56, y: 16 }); // 56px = 40px кнопка + отступ

    useEffect(() => {
        const handleMouseMove = (e) => {
            const button = buttonRef.current;
            if (!button) return;

            const rect = button.getBoundingClientRect();
            const distanceX = e.clientX - (rect.left + rect.width / 2);
            const distanceY = e.clientY - (rect.top + rect.height / 2);
            const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

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

    return (
        <div className="profile">
            <button
                ref={buttonRef}
                className="profile__icon-button"
                style={{
                    position: "fixed",
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    zIndex: 1000
                }}
            >
                <GoogleIcon className="profile__icon" />
            </button>
        </div>
    );
}
