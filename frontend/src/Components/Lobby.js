import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styling/Lobby.css';

const Lobby = () => {
    const [selectedDifficulty, setSelectedDifficulty] = useState(null);
    const navigate = useNavigate();

    const handlePlay = () => {
        if (selectedDifficulty) {
            navigate('/play', { state: { difficulty: selectedDifficulty } });
        }
    };

    const handleDifficultySelect = (difficulty) => {
        setSelectedDifficulty(difficulty);
    };

    return (
        <div className="lobby-container">
            <img src="/images/play.webp" alt="Background" className="background-image" />
            <div className="content-container">
                <h2 className="lobby-title">Select Difficulty</h2>
                <div className="difficulty-buttons">
                    <button
                        className={`difficulty-button ${selectedDifficulty === 'EASY' ? 'selected' : ''}`}
                        onClick={() => handleDifficultySelect('EASY')}
                    >
                        EASY
                    </button>
                    <button
                        className={`difficulty-button ${selectedDifficulty === 'NORMAL' ? 'selected' : ''}`}
                        onClick={() => handleDifficultySelect('NORMAL')}
                    >
                        NORMAL
                    </button>
                    <button
                        className={`difficulty-button ${selectedDifficulty === 'HARD' ? 'selected' : ''}`}
                        onClick={() => handleDifficultySelect('HARD')}
                    >
                        HARD
                    </button>
                </div>
                <button 
                    className="play-button" 
                    onClick={handlePlay} 
                    disabled={!selectedDifficulty} 
                >
                    PLAY
                </button>
            </div>
        </div>
    );
};

export default Lobby;
