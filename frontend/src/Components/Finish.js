import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../Styling/Finish.css';

const Finish = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Retrieve stats passed through location.state
    const { asteroidsDestroyed } = location.state || { asteroidsDestroyed: 0 };

    // Handler for Play Again button
    const handlePlayAgain = () => {
        navigate('/');  // Navigate back to Home
    };

    return (
        <div className="finish-container">
            <h1>Game Over</h1>
            <p>Asteroids Destroyed: {asteroidsDestroyed}</p>
            <button className="play-again-button" onClick={handlePlayAgain}>
                Play Again
            </button>
        </div>
    );
};

export default Finish;
