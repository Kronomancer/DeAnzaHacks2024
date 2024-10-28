import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../Styling/Play.css';

const Play = () => {
  const [words, setWords] = useState([]);
  const [asteroids, setAsteroids] = useState([]);
  const [activeWord, setActiveWord] = useState(''); // Word of the closest asteroid
  const [typedText, setTypedText] = useState(''); // Tracks the user's current input for the active word
  const asteroidIdRef = useRef(0);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Load words from words.txt
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

    // Get window size
    const updateWindowSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);

    return () => window.removeEventListener('resize', updateWindowSize);
  }, []);

  const spawnAsteroid = useCallback(() => {
    if (words.length === 0 || windowSize.width === 0) return;

    const randomWord = words[Math.floor(Math.random() * words.length)];
    const newAsteroid = {
      id: asteroidIdRef.current++,
      word: randomWord,
      x: Math.random() * (windowSize.width - 100),
      y: -50,
    };
    setAsteroids((prevAsteroids) => [...prevAsteroids, newAsteroid]);
  }, [words, windowSize.width]);

  useEffect(() => {
    const spawnInterval = setInterval(spawnAsteroid, 5000);
    return () => clearInterval(spawnInterval);
  }, [spawnAsteroid]);

  useEffect(() => {
    const moveAsteroids = () => {
      setAsteroids((prevAsteroids) => {
        return prevAsteroids.map((asteroid) => {
          const newY = asteroid.y + 1; // Adjust speed as needed
          return { ...asteroid, y: newY };
        });
      });
    };

    const moveInterval = setInterval(moveAsteroids, 50);
    return () => clearInterval(moveInterval);
  }, []);

  useEffect(() => {
    if (asteroids.length === 0) {
      setActiveWord('');
    } else {
      const closestAsteroid = asteroids.reduce((prev, curr) =>
        curr.y > prev.y ? curr : prev
      );
      setActiveWord(closestAsteroid.word);
    }
  }, [asteroids]);

  const handleTyping = useCallback(
    (e) => {
      const { key } = e;
      const ignoredKeys = [
        'Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape',
        'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End',
        'PageUp', 'PageDown',
      ];

      if (ignoredKeys.includes(key)) return;

      if (key === 'Enter') {
        // Only proceed if the typedText matches the active word
        if (typedText === activeWord) {
          setAsteroids((prevAsteroids) =>
            prevAsteroids.filter((asteroid) => asteroid.word !== activeWord)
          );
          setTypedText(''); // Clear input for the next word
        }
      } else if (key === 'Backspace') {
        setTypedText((prev) => prev.slice(0, -1));
      } else {
        setTypedText((prev) => prev + key);
      }
    },
    [typedText, activeWord]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleTyping);
    return () => {
      window.removeEventListener('keydown', handleTyping);
    };
  }, [handleTyping]);

  return (
    <div className="play-container">
      <img src="/images/play.webp" alt="Background" className="background-image" />
      {asteroids.map((asteroid) => {
        const size = Math.max(100, asteroid.word.length * 15); // Adjust multiplier as needed
        const isActive = asteroid.word === activeWord; // Check if this is the active asteroid
        return (
          <div
            key={asteroid.id}
            className={`asteroid ${isActive ? 'active-asteroid' : ''}`} // Add class for active asteroid styling
            style={{ left: asteroid.x, top: asteroid.y, width: size, height: size }}
          >
            <img
              src="/images/asteroid.webp"
              alt="Asteroid"
              className="asteroid-image"
              style={{ width: '100%', height: '100%' }}
            />
            <div className="asteroid-word">
              {/* Display each character with typing feedback */}
              {asteroid.word.split('').map((char, index) => {
                const typedChar = isActive ? typedText[index] : undefined;
                const className =
                  typedChar === undefined
                    ? ''
                    : typedChar === char
                    ? 'correct'
                    : 'incorrect';
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
