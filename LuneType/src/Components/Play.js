import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../Styling/Play.css';
import { db, auth } from '../Components/FirebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const Play = () => {
  const { state } = useLocation();
  const difficulty = state?.difficulty || 'EASY';

  // Game settings based on difficulty
  const speed = difficulty === 'HARD' ? 5 : difficulty === 'NORMAL' ? 4 : 3;
  const spawnRate = difficulty === 'HARD' ? 2000 : difficulty === 'NORMAL' ? 3500 : 5000;

  const [words, setWords] = useState([]);
  const [asteroids, setAsteroids] = useState([]);
  const [activeWord, setActiveWord] = useState('');
  const [typedText, setTypedText] = useState('');
  const [asteroidsDestroyed, setAsteroidsDestroyed] = useState(0);
  const asteroidIdRef = useRef(0);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [usedWords, setUsedWords] = useState([]);
  const navigate = useNavigate();

  // High score update flag
  const shouldUpdateHighScore = difficulty === 'HARD';

  // Load words and set window size on mount
  useEffect(() => {
    fetch('/Text/words.txt')
      .then((response) => response.text())
      .then((text) => {
        const wordArray = text
          .split('\n')
          .map((word) => word.trim())
          .filter((word) => word.length > 0);
        setWords(wordArray);
      })
      .catch((error) => console.error('Error loading words:', error));

    const updateWindowSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);

    return () => window.removeEventListener('resize', updateWindowSize);
  }, []);

  // Spawn a new asteroid at random positions
  const spawnAsteroid = useCallback(() => {
    if (words.length === 0 || windowSize.width === 0) return;

    const boundaryMargin = 50;

    if (usedWords.length === words.length) {
      setUsedWords([]);
    }

    const availableWords = words.filter((word) => !usedWords.includes(word));
    const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];

    const size = Math.max(100, randomWord.length * 15);
    const x = Math.random() * (windowSize.width - 2 * boundaryMargin - size) + boundaryMargin;
    const y = -50;

    const newAsteroid = {
      id: asteroidIdRef.current++,
      word: randomWord,
      x,
      y,
      size,
    };

    setAsteroids((prevAsteroids) => [...prevAsteroids, newAsteroid]);
    setUsedWords((prevUsedWords) => [...prevUsedWords, randomWord]);
  }, [words, windowSize.width, usedWords]);

  // Set interval for spawning asteroids
  useEffect(() => {
    const spawnInterval = setInterval(spawnAsteroid, spawnRate);
    return () => clearInterval(spawnInterval);
  }, [spawnAsteroid, spawnRate]);

  // Update high score only if on HARD mode
  const updateHighScore = useCallback(async () => {
    if (!shouldUpdateHighScore) return;

    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const currentHighScore = userData.highestScore || 0;

        if (asteroidsDestroyed > currentHighScore) {
          await updateDoc(userRef, { highestScore: asteroidsDestroyed });
        }
      }
    }
  }, [asteroidsDestroyed, shouldUpdateHighScore]);

  // Trigger game end
  const handleGameEnd = useCallback(async () => {
    await updateHighScore();  // Update high score only if on HARD mode
    navigate('/Finish', { state: { asteroidsDestroyed, difficulty } });  // Pass difficulty to Finish
  }, [updateHighScore, asteroidsDestroyed, navigate, difficulty]);

  // Move asteroids and check if they go off-screen
  useEffect(() => {
    const moveAsteroids = () => {
      setAsteroids((prevAsteroids) => {
        const updatedAsteroids = prevAsteroids.map((asteroid) => ({
          ...asteroid,
          y: asteroid.y + speed,
        }));
        
        // Check if any asteroid has gone off-screen
        const hasAsteroidGoneOffScreen = updatedAsteroids.some(
          (asteroid) => asteroid.y > windowSize.height
        );

        if (hasAsteroidGoneOffScreen) {
          handleGameEnd(); // End the game if an asteroid goes off-screen
        }

        return updatedAsteroids;
      });
    };

    const moveInterval = setInterval(moveAsteroids, 50);
    return () => clearInterval(moveInterval);
  }, [windowSize.height, speed, handleGameEnd]);

  // Set active word as the closest asteroid
  useEffect(() => {
    if (asteroids.length === 0) {
      setActiveWord('');
    } else {
      const closestAsteroid = asteroids.reduce((prev, curr) => (curr.y > prev.y ? curr : prev));
      setActiveWord(closestAsteroid.word);
    }
  }, [asteroids]);

  // Handle typing logic for destroying asteroids
  const handleTyping = useCallback(
    (e) => {
      const { key } = e;
      const ignoredKeys = [
        'Shift',
        'Control',
        'Alt',
        'Meta',
        'CapsLock',
        'Tab',
        'Escape',
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
        'Home',
        'End',
        'PageUp',
        'PageDown',
      ];

      if (ignoredKeys.includes(key)) return;

      if (key === 'Enter') {
        if (typedText === activeWord) {
          setAsteroids((prevAsteroids) =>
            prevAsteroids.filter((asteroid) => asteroid.word !== activeWord)
          );
          setTypedText('');
          setAsteroidsDestroyed((prev) => prev + 1);
        }
      } else if (key === 'Backspace') {
        setTypedText((prev) => prev.slice(0, -1));
      } else {
        setTypedText((prev) => prev + key);
      }
    },
    [typedText, activeWord]
  );

  // Attach typing event listener
  useEffect(() => {
    window.addEventListener('keydown', handleTyping);
    return () => {
      window.removeEventListener('keydown', handleTyping);
    };
  }, [handleTyping]);

  return (
    <div className="play-container">
      <img src="/Images/play.webp" alt="Background" className="background-image" />
      {asteroids.map((asteroid) => {
        const isActive = asteroid.word === activeWord;
        return (
          <div
            key={asteroid.id}
            className={`asteroid ${isActive ? 'active-asteroid' : ''}`}
            style={{ left: asteroid.x, top: asteroid.y, width: asteroid.size, height: asteroid.size }}
          >
            <img
              src="/images/asteroid.webp"
              alt="Asteroid"
              className="asteroid-image"
              style={{ width: '100%', height: '100%' }}
            />
            <div className="asteroid-word">
              {asteroid.word.split('').map((char, index) => {
                const typedChar = isActive ? typedText[index] : undefined;
                const className =
                  typedChar === undefined ? '' : typedChar === char ? 'correct' : 'incorrect';
                return (
                  <span key={index} className={className}>
                    {char}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Play;
