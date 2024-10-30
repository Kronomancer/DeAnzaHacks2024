import React, { useState, useEffect, useCallback } from 'react';
import '../Styling/InputLogic.css';

const InputLogic = ({ activeLine, onComplete }) => {
  const [typedText, setTypedText] = useState('');
  const [isCursorVisible, setIsCursorVisible] = useState(false);

  // Show cursor when there is an active word
  useEffect(() => {
    setIsCursorVisible(activeLine !== '');
    setTypedText(''); // Clear previous input when the active word changes
  }, [activeLine]);

  // Handle typing functionality and cursor progression
  const handleKeyPress = useCallback(
    (e) => {
      const { key } = e;
      const ignoredKeys = [
        'Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape',
        'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End',
        'PageUp', 'PageDown',
      ];

      if (ignoredKeys.includes(key)) return;

      if (key === 'Enter') {
        if (typedText === activeLine) { // If the entire word is correctly typed
          onComplete(); // Trigger removal of the current asteroid
          setTypedText(''); // Clear the typed text for the next word
        }
      } else if (key === 'Backspace') {
        setTypedText((prev) => prev.slice(0, -1));
      } else {
        setTypedText((prev) => prev + key);
      }
    },
    [typedText, activeLine, onComplete]
  );

  // Listen for keydown events
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  // Render the word with the cursor to the left and moving along with typing
  const renderTextWithCursor = () => {
    const cursorElement = (
      <span
        key="cursor"
        className="cursor"
        style={{ visibility: isCursorVisible ? 'visible' : 'hidden' }}
      >
        |
      </span>
    );

    const wordChars = activeLine.split('').map((char, index) => {
      const typedChar = typedText[index];
      const className =
        typedChar === undefined
          ? ''
          : typedChar === char
          ? 'correct'
          : 'incorrect';

      return (
        <span key={`active-${index}`} className={className}>
          {char}
        </span>
      );
    });

    // Place the cursor directly to the left of the word, moving it along as the user types
    return (
      <div className="active-line">
        {cursorElement /* Start cursor at the left of the word */}
        {wordChars}
      </div>
    );
  };

  return (
    <div className="input-logic-container">
      <span className="text-display">{renderTextWithCursor()}</span>
    </div>
  );
};

export default InputLogic;
