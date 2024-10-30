import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styling/Lobby.css';
import { auth, db } from '../Components/FirebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const Lobby = () => {
    const [selectedDifficulty, setSelectedDifficulty] = useState(null);
    const [username, setUsername] = useState('');
    const [showHelp, setShowHelp] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsername = async () => {
            const user = auth.currentUser;
            if (user) {
                try {
                    const userRef = doc(db, "users", user.uid);
                    const userDoc = await getDoc(userRef);

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUsername(userData.username || 'User');
                    }
                } catch (error) {
                    console.error("Error fetching username:", error);
                }
            }
        };

        fetchUsername();
    }, []);

    const handlePlay = () => {
        if (selectedDifficulty) {
            navigate('/play', { state: { difficulty: selectedDifficulty } });
        }
    };

    const handleDifficultySelect = (difficulty) => {
        setSelectedDifficulty(difficulty);
    };

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                localStorage.removeItem("isLoggedIn");
                navigate('/login');
            })
            .catch((error) => {
                console.error("Logout Error:", error);
            });
    };

    const toggleHelpModal = () => {
        setShowHelp(!showHelp);
    };

    return (
        <div className="lobby-container">
            <img src="/images/play.webp" alt="Background" className="background-image" />

            <div className="username-label">Ready to Play, {username}?</div>

            <button className="sign-out-button" onClick={handleLogout}>Sign Out</button>
            
            <div className="content-container">
                <h2 className="lobby-title">Select Difficulty</h2>
                <div className="difficulty-buttons">
                    <button
                        className={`difficulty-button ${selectedDifficulty === 'EASY' ? 'easy' : ''}`}
                        onClick={() => handleDifficultySelect('EASY')}
                    >
                        EASY
                    </button>
                    <button
                        className={`difficulty-button ${selectedDifficulty === 'NORMAL' ? 'normal' : ''}`}
                        onClick={() => handleDifficultySelect('NORMAL')}
                    >
                        NORMAL
                    </button>
                    <button
                        className={`difficulty-button ${selectedDifficulty === 'HARD' ? 'hard' : ''}`}
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
                
                <button 
                    className="help-button" 
                    onClick={toggleHelpModal}
                >
                    HELP
                </button>
            </div>

            {showHelp && (
                <div className="help-modal-overlay" onClick={toggleHelpModal}>
                    <div className="help-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>How To Play</h3>
                        <p><strong>Modes:</strong><br /> LuneType features three difficulty levels: Easy, Normal, and Hard. Each level increases spawn rates and asteroid speed.</p>
                        <p><strong>Objective:</strong><br /> Type the word displayed on each asteroid before it reaches the bottom of the screen.</p>
                        <p><strong>Asteroids:</strong><br /> Each asteroid spawns at the top with a unique word. The current target asteroid will always be the one closest to the bottom.</p>
                        <p><strong>Progression:</strong><br /> Successfully typed words destroy the asteroid, allowing the player to continue the game. You must type out the full word with no errors and hit "Enter" once you are done.</p>
                        <p><strong>Losing Condition:</strong><br /> The player loses if an asteroid reaches the bottom of the screen and exits the frame.</p>
                        <p><strong>Leaderboard:</strong><br /> The leaderboard only counts attempts in the HARD difficulty.</p>
                        <button className="close-button" onClick={toggleHelpModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Lobby;
