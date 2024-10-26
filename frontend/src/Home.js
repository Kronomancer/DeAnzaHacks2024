import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const [currentWord, setCurrentWord] = useState("Loading...");
    const [userInput, setUserInput] = useState("");
    const [words, setWords] = useState([]);
    const [timeLeft, setTimeLeft] = useState(3); // 60 seconds timer
    const [isTypingStarted, setIsTypingStarted] = useState(false);
    const [isInputDisabled, setIsInputDisabled] = useState(false);
    const [wordsTyped, setWordsTyped] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        // Fetch words from a text file in the public folder
        fetch('/words.txt')
            .then(response => response.text())
            .then(text => {
                const wordsArray = text.split(/\s+/); // Split text by whitespace
                setWords(wordsArray);                // Store words in state
                setCurrentWord(wordsArray[0]);       // Set the first word as initial display
            })
            .catch(error => console.error("Error loading text file:", error));
    }, []);

    useEffect(() => {
        // Start the timer when typing starts
        if (isTypingStarted && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);

            return () => clearInterval(timer); // Clear timer on cleanup
        }

        // When timer reaches 0, navigate to Finish screen and pass stats
        if (timeLeft === 0) {
            const wpm = wordsTyped; // Calculate Words Per Minute
            setIsInputDisabled(true);

            // Navigate to Finish.js with the stats
            navigate('/finish', { state: { wordsTyped, wpm } });
        }
    }, [isTypingStarted, timeLeft, wordsTyped, navigate]);

    // Check user input and move to the next word if the word is correct
    const handleChange = (e) => {
        const value = e.target.value;
        setUserInput(value);

        // Start the timer on the first character typed
        if (!isTypingStarted && value.length === 1) {
            setIsTypingStarted(true);
        }

        // If the user input matches the current word, move to the next word
        if (value.trim() === currentWord) {
            setUserInput("");  // Clear input field
            setWordsTyped(prevCount => prevCount + 1); // Increase words typed count
            const nextWordIndex = Math.floor(Math.random() * words.length);
            setCurrentWord(words[nextWordIndex]); // Set a new random word
        }
    };

    return (
        <div className="home-container">
            <div className="timer-display">
                <h2>Time Left: {timeLeft}s</h2>
            </div>
            <div className="display-window">
                <h1>{currentWord}</h1>
            </div>
            <input
                type="text"
                className="input-field"
                placeholder="Type the word here..."
                value={userInput}
                onChange={handleChange}
                disabled={isInputDisabled} // Disable input when timer hits 0
                autoFocus
            />
        </div>
    );
};

export default Home;
