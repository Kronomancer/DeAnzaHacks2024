import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../Styling/Finish.css';

const Finish = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Retrieve stats passed through location.state
    const { wordsTyped, wpm } = location.state || { wordsTyped: 0, wpm: 0 };

    // Handler for Play Again button
    const handlePlayAgain = () => {
        navigate('/');  // Navigate back to Home
    };

    return (
        <div className="finish-container">
            <h1>Game Over</h1>
            <p>Words Typed: {wordsTyped}</p>
            <p>Words Per Minute (WPM): {wpm}</p>
            <button className="play-again-button" onClick={handlePlayAgain}>
                Play Again
            </button>
        </div>
    );
};

export default Finish;
