import React from "react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as SettingsIcon } from "../../../../assets/icons/settings.svg";
import "./profileb.scss";

export default function ProfileB() {
    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate('/profile');
    };

    return (
        <div className="profileb">
            <button 
                className="profileb__icon-button"
                onClick={handleProfileClick}
            >
                <SettingsIcon className="profileb__icon"/>
            </button>
        </div>
    );
}