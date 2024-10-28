import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styling/Play.css';

const Play = () => {
  const [words, setWords] = useState([]);
  const [asteroids, setAsteroids] = useState([]);
  const [activeWord, setActiveWord] = useState('');
  const [typedText, setTypedText] = useState('');
  const [asteroidsDestroyed, setAsteroidsDestroyed] = useState(0); // Track destroyed asteroids
  const asteroidIdRef = useRef(0);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [usedWords, setUsedWords] = useState([]);
  const navigate = useNavigate();

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

  useEffect(() => {
    const spawnInterval = setInterval(spawnAsteroid, 5000);
    return () => clearInterval(spawnInterval);
  }, [spawnAsteroid]);

  useEffect(() => {
    const moveAsteroids = () => {
      setAsteroids((prevAsteroids) =>
        prevAsteroids.map((asteroid) => {
          const newY = asteroid.y + 1;
          if (newY > windowSize.height) {
            // Navigate to Finish screen if asteroid is out of bounds
            navigate('/Finish', {
              state: { asteroidsDestroyed },
            });
          }
          return { ...asteroid, y: newY };
        })
      );
    };

    const moveInterval = setInterval(moveAsteroids, 50);
    return () => clearInterval(moveInterval);
  }, [navigate, windowSize.height, asteroidsDestroyed]);

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
        if (typedText === activeWord) {
          setAsteroids((prevAsteroids) =>
            prevAsteroids.filter((asteroid) => asteroid.word !== activeWord)
          );
          setTypedText('');
          setAsteroidsDestroyed((prev) => prev + 1); // Increment destroyed count
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
