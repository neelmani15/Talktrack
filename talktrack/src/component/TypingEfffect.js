import React, { useState, useEffect } from 'react';

const TypingEffect = ({ messages, typingSpeed = 150, delay = 2000 }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loop, setLoop] = useState(0);

  useEffect(() => {
    let timeout;

    if (!isDeleting && displayedText.length < messages[currentMessageIndex].length) {
      timeout = setTimeout(() => {
        setDisplayedText(messages[currentMessageIndex].substring(0, displayedText.length + 1));
      }, typingSpeed);
    } else if (isDeleting && displayedText.length > 0) {
      timeout = setTimeout(() => {
        setDisplayedText(messages[currentMessageIndex].substring(0, displayedText.length - 1));
      }, typingSpeed / 2);
    } else if (!isDeleting && displayedText.length === messages[currentMessageIndex].length) {
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, delay);
    } else if (isDeleting && displayedText.length === 0) {
      setIsDeleting(false);
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, messages, currentMessageIndex, typingSpeed, delay]);

  return (
    <h1 className="text-4xl font-bold text-center mb-4 text-white">
      {displayedText}
    </h1>
  );
};

export default TypingEffect;
