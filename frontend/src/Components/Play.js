import React, { useState, useEffect } from 'react';
import '../Styling/Play.css';
import InputLogic from './InputLogic';

// Function to shuffle an array for randomness
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Updated splitIntoLines function with line continuation logic
const splitIntoLines = (sentences, maxLineLength = 90) => {
  const lines = [];
  let currentLineWords = [];
  let currentLength = 0;
  let sentenceIndex = 0;

  const getNextSentence = () => {
    if (sentenceIndex < sentences.length) {
      return sentences[sentenceIndex++];
    }
    return null;
  };

  let currentSentence = getNextSentence();

  while (currentSentence) {
    const words = currentSentence.split(' ');

    for (let word of words) {
      const potentialLength = currentLength + word.length + (currentLineWords.length > 0 ? 1 : 0);

      if (potentialLength > maxLineLength && currentLineWords.length > 0) {
        lines.push(currentLineWords.join(' '));
        currentLineWords = [word]; // Start a new line with the current word
        currentLength = word.length;
      } else {
        currentLineWords.push(word);
        currentLength = potentialLength;
      }
    }

    if (currentLineWords.join(' ').length < maxLineLength) {
      currentSentence = getNextSentence();
    } else {
      lines.push(currentLineWords.join(' '));
      currentLineWords = [];
      currentLength = 0;
      currentSentence = getNextSentence();
    }
  }

  if (currentLineWords.length) {
    lines.push(currentLineWords.join(' '));
  }

  return lines;
};

const Play = () => {
  const [lines, setLines] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  useEffect(() => {
    fetch('/Text/words.txt')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((data) => {
        if (!data) {
          console.error('Fetched data is empty or undefined');
          return;
        }
        const processedSentences = processText(data);
        const randomizedSentences = shuffleArray(processedSentences);
        const splitLines = splitIntoLines(randomizedSentences);
        setLines(splitLines);
      })
      .catch((error) => {
        console.error('Error fetching or processing words.txt:', error);
      });
  }, []);

  const processText = (text) => {
    const abbreviations = [
      'Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.', 'Sr.', 'Jr.', 'St.', 'vs.', 'Lt.', 'Col.', 'Gen.',
    ];
    const placeholderMap = {};
    abbreviations.forEach((abbrev, index) => {
      const placeholder = `__ABBR${index}__`;
      placeholderMap[placeholder] = abbrev;
      const regex = new RegExp(abbrev.replace('.', '\\.'), 'g');
      text = text.replace(regex, placeholder);
    });

    let sentences = text.split(/(?<=[.!?])\s+/);

    sentences = sentences.map((sentence) => {
      Object.keys(placeholderMap).forEach((placeholder) => {
        const regex = new RegExp(placeholder, 'g');
        sentence = sentence.replace(regex, placeholderMap[placeholder]);
      });
      return sentence;
    });

    return sentences;
  };

  const handleLineComplete = () => {
    setCurrentLineIndex((prevIndex) => prevIndex + 1);
  };

  return (
    <div className="play-container">
      <div className="sentence-row">
        <InputLogic 
          targetLines={lines.slice(currentLineIndex, currentLineIndex + 3)} 
          onComplete={handleLineComplete} 
        />
      </div>
    </div>
  );
};

export default Play;
