// Start.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styling/Start.css';

const Start = () => {
    const navigate = useNavigate();

    const handleStart = () => {
        navigate('/home');
    };

    return (
        <div className="start-container">
            <button className="start-button" onClick={handleStart}>
                Start
            </button>
        </div>
    );
};

export default Start;
