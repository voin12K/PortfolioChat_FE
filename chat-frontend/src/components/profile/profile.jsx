import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './profile.scss';

export default function Profile() {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [preview, setPreview] = useState('');
    const navigate = useNavigate();
    const { logout } = useAuth();
 
    useEffect(() => {
        fetch('https://portfoliochat-be.onrender.com/api/auth/me', {
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
            if (data.profileImage) {
                setPreview(data.profileImage);
            }
        })
        .catch(err => {
            console.error('Error loading profile:', err);
            toast.error('Failed to load profile');
        });
    }, []);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

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
            const res = await fetch('https://portfoliochat-be.onrender.com/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: formData,
            });

            const result = await res.json();
            if (!res.ok) {
                toast.error(result.error || 'Profile update error');
            } else {
                toast.success('Profile updated successfully!');
            }
        } catch (error) {
            console.error('Sending error:', error);
            toast.error('There was an error updating your profile.');
        }
    };

    const handleLogout = () => {
        logout();
        toast.success('You have been logged out');
    };

    return (
        <div className="profile">
            <Toaster position="top-center" richColors />
            <form onSubmit={handleSubmit} className="profile-form">
                <div className="profile-header">
                    <button 
                        type="button" 
                        className="back-button"
                        onClick={() => navigate('/')}
                    >
                        Back
                    </button>
                    <h2>Profile settings</h2>
                    <button 
                        type="button" 
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
                <div className="avatar-preview">
                    {preview ? (
                        <img src={preview} alt="Аватар" />
                    ) : (
                        <div className="avatar-placeholder">
                            <span>Select image</span>
                        </div>
                    )}
                </div>
                <div className="file-upload-wrapper">
                    <span className="file-upload-text">Select an avatar</span>
                    <label className="file-upload-button">
                        Select file
                        <input 
                            type="file" 
                            onChange={handleAvatarChange} 
                            accept="image/*" 
                            className="file-upload-input"
                        />
                    </label>
                </div>
                <label>
                    Name:
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                    />
                </label>
                <label>
                    Nickname:
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                    />
                </label>
                <button type="submit">Save</button>
            </form>
        </div>
    );
}