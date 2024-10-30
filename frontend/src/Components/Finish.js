import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../Styling/Finish.css';
import { auth, db } from '../Components/FirebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const Finish = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { asteroidsDestroyed } = location.state || { asteroidsDestroyed: 0 };
    const [highestScore, setHighestScore] = useState(0);

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
                // Verify that the user document exists in Firestore
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

    return (
        <div className="finish-container">
            <h1>Game Over</h1>
            <p>Asteroids Destroyed: {asteroidsDestroyed}</p>
            <p>Highest Score: {highestScore}</p>
            <button className="play-again-button" onClick={handlePlayAgain}>
                Play Again
            </button>
        </div>
    );
};

export default Finish;
