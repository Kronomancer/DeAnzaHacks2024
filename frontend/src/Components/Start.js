import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styling/Start.css';

const Start = () => {
    const navigate = useNavigate();

    const handleStart = () => {
        navigate('/lobby');
    };

    return (
        <div className="start-container">
            <h1 className="start-title">LuneType</h1>
            <button className="start-button" onClick={handleStart}>
                START
            </button>
        </div>
    );
};

export default Start;
