import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import './ProfileUpdate.css'; // Ensure this CSS file is correctly defined for styling

function ProfileUpdate() {
    const { authTokens, user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        full_name: '',
        bio: '',
        image: null,
        password: '',
        password2: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username,
                email: user.email,
                full_name: user.full_name,
                bio: user.bio,
                image: user.image,
                password: '',
                password2: ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            image: e.target.files[0]
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = new FormData();
        form.append('username', formData.username);
        form.append('email', formData.email);
        form.append('full_name', formData.full_name);
        form.append('bio', formData.bio);
        if (formData.image) {
            form.append('image', formData.image);
        }
        if (formData.password) {
            form.append('password', formData.password);
            form.append('password2', formData.password2);
        }

        fetch('http://127.0.0.1:8000/authentication/profile/update/', {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authTokens.access}`
            },
            body: form
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error(data.error);
                } else {
                    alert('Profile updated successfully');
                }
            })
            .catch(err => console.error(err));
    };

    return (
        <div className="profile-update-container">
            <h2>Update Profile</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Bio</label>
                    <textarea name="bio" value={formData.bio} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Profile Image</label>
                    <input type="file" name="image" onChange={handleFileChange} />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Confirm Password</label>
                    <input type="password" name="password2" value={formData.password2} onChange={handleChange} />
                </div>
                <button type="submit" className="btn btn-primary">Update</button>
            </form>
        </div>
    );
}

export default ProfileUpdate;
