import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../Styling/Finish.css';
import { auth, db } from '../Components/FirebaseConfig';
import { doc, getDoc, updateDoc, collection, getDocs, orderBy, query } from 'firebase/firestore';

const Finish = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { asteroidsDestroyed } = location.state || { asteroidsDestroyed: 0 };
    const [highestScore, setHighestScore] = useState(0);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [leaderboardData, setLeaderboardData] = useState([]);

    useEffect(() => {
        const updateHighestScore = async () => {
            const user = auth.currentUser;
            if (user) {
                try {
                    const userRef = doc(db, "users", user.uid);
                    const userDoc = await getDoc(userRef);

                    let currentHighestScore = 0;
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        currentHighestScore = userData.highestScore || 0;
                    } else {
                        await updateDoc(userRef, { highestScore: 0 });
                    }

                    if (asteroidsDestroyed > currentHighestScore) {
                        await updateDoc(userRef, { highestScore: asteroidsDestroyed });
                        setHighestScore(asteroidsDestroyed);
                    } else {
                        setHighestScore(currentHighestScore);
                    }
                } catch (error) {
                    console.error("Error updating highest score:", error);
                }
            }
        };

        updateHighestScore();
    }, [asteroidsDestroyed]);

    // Updated Play Again handler with authentication check
    const handlePlayAgain = async () => {
        const user = auth.currentUser;

        if (user) {
            try {
                const userRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    navigate('/lobby'); // Navigate to Lobby if user is authenticated
                } else {
                    console.error("User document not found in Firestore.");
                    navigate('/login');
                }
            } catch (error) {
                console.error("Error verifying user document:", error);
                navigate('/login');
            }
        } else {
            navigate('/login'); // Navigate to login if no user is authenticated
        }
    };

    const toggleLeaderboardModal = () => {
        setShowLeaderboard(!showLeaderboard);
    };

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const leaderboardRef = collection(db, "users");
                const leaderboardQuery = query(leaderboardRef, orderBy("highestScore", "desc"));
                const leaderboardSnapshot = await getDocs(leaderboardQuery);

                const leaderboard = leaderboardSnapshot.docs.map(doc => ({
                    username: doc.data().username,  // Ensure username is retrieved
                    score: doc.data().highestScore || 0
                }));

                setLeaderboardData(leaderboard);
            } catch (error) {
                console.error("Error fetching leaderboard data:", error);
            }
        };

        if (showLeaderboard) {
            fetchLeaderboard();
        }
    }, [showLeaderboard]);

    return (
        <div className="finish-container">
            <h1>Game Over</h1>
            <p>Asteroids Destroyed: {asteroidsDestroyed}</p>
            <p>Highest Score: {highestScore}</p>
            
            {/* Leaderboard Button */}
            <button className="leaderboard-button" onClick={toggleLeaderboardModal}>
                LEADERBOARD
            </button>

            <button className="play-again-button" onClick={handlePlayAgain}>
                Play Again
            </button>

            {showLeaderboard && (
                <div className="leaderboard-modal-overlay" onClick={toggleLeaderboardModal}>
                    <div className="leaderboard-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>LEADERBOARD</h3>
                        <div className="leaderboard-content">
                            <div className="leaderboard-header">
                                <span>Username</span>
                                <span>Score</span>
                            </div>
                            {leaderboardData.length > 0 ? (
                                leaderboardData.map((player, index) => (
                                    <div key={index} className="leaderboard-row">
                                        <span>{player.username}</span>
                                        <span>{player.score}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="leaderboard-row">
                                    <span>N/A</span>
                                    <span>N/A</span>
                                </div>
                            )}
                        </div>
                        <button className="close-button" onClick={toggleLeaderboardModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Finish;
