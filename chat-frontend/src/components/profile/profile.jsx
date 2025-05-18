import React, { useState, useEffect } from 'react';
import './profile.scss';

export default function Profile() {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [preview, setPreview] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('http://localhost:5000/api/auth/me', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        })
        .then(res => {
            if (!res.ok) throw new Error('Error loading profile');
            return res.json();
        })
        .then(data => {
            setName(data.name || '');
            setUsername(data.username || '');
            setPreview(data.profileImage || '');
        })
        .catch(err => console.error('Error loading profile:', err));
    }, []);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        setAvatar(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        if (avatar) formData.append('avatar', avatar);
        formData.append('name', name);
        formData.append('username', username);

        try {
            const res = await fetch('http://localhost:5000/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: formData,
            });

            const result = await res.json();
            if (!res.ok) {
                setMessage(result.error || 'Profile update error');
            } else {
                setMessage('Profile updated successfully!');
            }
        } catch (error) {
            console.error('Sending error:', error);
            setMessage('There was an error updating your profile.');
        }
    };

    return (
        <div className="profile">
            <h2>Настройки профиля</h2>
            <form onSubmit={handleSubmit} className="profile-form">
                <div className="avatar-preview">
                    {preview && <img src={preview} alt="Avatar" />}
                </div>
                <label>
                    Аватар:
                    <input type="file" onChange={handleAvatarChange} />
                </label>
                <label>
                    Имя:
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                    />
                </label>
                <label>
                    Никнейм:
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                    />
                </label>
                <button type="submit">Сохранить</button>
                {message && <p className="message">{message}</p>}
            </form>
        </div>
    );
}