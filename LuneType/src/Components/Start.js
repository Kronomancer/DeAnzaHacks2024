import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styling/Start.css';

const Start = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    };

    const handleRegister = () => {
        navigate('/register');
    };

    return (
        <div className="start-container">
            <h1 className="start-title">LuneType</h1>
            <button className="start-button" onClick={handleLogin}>
                LOGIN
            </button>
            <button className="start-button" onClick={handleRegister}>
                REGISTER
            </button>
        </div>
    );
};

export default Start;
