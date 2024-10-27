import React, { useState, useEffect, useCallback } from 'react';
import '../Styling/InputLogic.css';

const InputLogic = ({ targetLines, onComplete }) => {
  const [typedText, setTypedText] = useState('');
  const [isCursorVisible, setIsCursorVisible] = useState(true);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setIsCursorVisible((visible) => !visible);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  const handleKeyPress = useCallback((e) => {
    const { key } = e;
    const ignoredKeys = [
      'Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape', 'ArrowLeft',
      'ArrowRight', 'ArrowUp', 'ArrowDown', 'Enter', 'Home', 'End', 'PageUp', 'PageDown'
    ];

    if (ignoredKeys.includes(key)) return;

    const firstLineTarget = targetLines && targetLines[0] ? targetLines[0] : '';
    const updatedText = key === 'Backspace' ? typedText.slice(0, -1) : typedText + key;
    setTypedText(updatedText);

    if (updatedText.trim() === firstLineTarget) {
      onComplete();
      setTypedText('');
    }
  }, [typedText, targetLines, onComplete]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  const renderTextWithCursor = () => {
    const firstLine = targetLines && targetLines[0] ? targetLines[0] : '';
    const secondLine = targetLines && targetLines[1] ? targetLines[1] : '';
    const thirdLine = targetLines && targetLines[2] ? targetLines[2] : '';

    const renderLine = (line, lineIndex) => {
      const startIndex = lineIndex === 0 ? 0 : targetLines.slice(0, lineIndex).join(' ').length + lineIndex;
      return line.split('').map((char, index) => {
        const charIndex = startIndex + index;
        const typedChar = typedText[charIndex];
        const className = typedChar === undefined
          ? ''
          : typedChar === char
          ? 'correct'
          : 'incorrect';

        return (
          <span key={`${lineIndex}-${index}`} className={className}>
            {char}
          </span>
        );
      });
    };

    const firstLineChars = renderLine(firstLine, 0);
    const secondLineChars = renderLine(secondLine, 1);
    const thirdLineChars = renderLine(thirdLine, 2);

    const cursorPosition = typedText.length;
    const cursorElement = (
      <span
        key="cursor"
        className="cursor"
        style={{ visibility: isCursorVisible ? 'visible' : 'hidden' }}
      >
        |
      </span>
    );

    if (firstLine && cursorPosition < firstLine.length) {
      firstLineChars.splice(cursorPosition, 0, cursorElement);
    } else if (secondLine && cursorPosition < firstLine.length + secondLine.length + 1) {
      const secondLineCursorPos = cursorPosition - firstLine.length - 1;
      secondLineChars.splice(secondLineCursorPos, 0, cursorElement);
    } else if (thirdLine) {
      const thirdLineCursorPos = cursorPosition - firstLine.length - secondLine.length - 2;
      thirdLineChars.splice(thirdLineCursorPos, 0, cursorElement);
    }

    return (
      <>
        <div>{firstLineChars}</div>
        <div>{secondLineChars}</div>
        <div>{thirdLineChars}</div>
      </>
    );
  };

  return (
    <div className="input-logic-container">
      <span className="text-display">{renderTextWithCursor()}</span>
    </div>
  );
};

export default InputLogic;
