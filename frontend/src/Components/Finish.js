import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../Styling/Finish.css';
import { auth, db } from '../Components/FirebaseConfig'; // Import Firebase auth and db
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // Import Firestore functions

const Finish = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Retrieve stats passed through location.state
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
                        // Initialize user's highestScore to 0 if the document doesn't exist
                        await updateDoc(userRef, { highestScore: 0 });
                    }

                    // Compare with the current score
                    if (asteroidsDestroyed > currentHighestScore) {
                        // Update the highestScore in Firestore
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

    // Handler for Play Again button
    const handlePlayAgain = () => {
        navigate('/');  // Navigate back to Home
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
