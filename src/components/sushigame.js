import React, { useState, useEffect } from "react";

const SUSHI_TYPES = [
  { name: "Salmon Nigiri", emoji: "🍣", points: 10 },
  { name: "Tuna Roll", emoji: "🍱", points: 15 },
  { name: "Shrimp Tempura", emoji: "🦐", points: 20 },
  { name: "California Roll", emoji: "🥢", points: 12 },
  { name: "Dragon Roll", emoji: "🐉", points: 25 },
];

const SushiGame = () => {
  // Previous state declarations and functions remain the same
  const [array, setArray] = useState(new Array(6).fill(""));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targetIndex, setTargetIndex] = useState(null);
  const [targetSushi, setTargetSushi] = useState(null);
  const [message, setMessage] = useState("");
  const [streak, setStreak] = useState(0);

  // Previous useEffect and function implementations remain the same
  useEffect(() => {
    let timer;
    if (isPlaying && timeLeft > 0 && !gameOver) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setMessage("Time's up! ⏰");
      loseLife();
    }
    return () => clearInterval(timer);
  }, [timeLeft, isPlaying, gameOver]);

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setLives(3);
    setStreak(0);
    setArray(new Array(6).fill(""));
    generateNewTarget();
    setTimeLeft(30);
    setMessage("Welcome! Place the sushi at the correct index!");
  };

  const generateNewTarget = () => {
    const newTargetIndex = Math.floor(Math.random() * 6);
    const newSushi =
      SUSHI_TYPES[Math.floor(Math.random() * SUSHI_TYPES.length)];
    setTargetIndex(newTargetIndex);
    setTargetSushi(newSushi);
    setTimeLeft(30);
  };

  const loseLife = () => {
    const newLives = lives - 1;
    setStreak(0);
    if (newLives === 0) {
      setGameOver(true);
      setIsPlaying(false);
      setMessage("Game Over! 🎮");
    } else {
      setLives(newLives);
      generateNewTarget();
      setMessage("Wrong index! Try again! 😅");
    }
  };

  const moveLeft = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const moveRight = () => {
    if (currentIndex < array.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const placeSushi = () => {
    if (!isPlaying || gameOver) return;

    if (array[currentIndex] === "") {
      if (currentIndex === targetIndex) {
        const newArray = [...array];
        newArray[currentIndex] = targetSushi;
        setArray(newArray);
        const newStreak = streak + 1;
        setStreak(newStreak);
        const bonusPoints = Math.floor(newStreak / 3) * 10;
        setScore(score + targetSushi.points + bonusPoints);
        setMessage(
          `Perfect! ${
            bonusPoints > 0 ? `Streak bonus: +${bonusPoints} points! 🔥` : "✨"
          }`
        );
        generateNewTarget();
      } else {
        loseLife();
      }
    }
  };

  const removeSushi = () => {
    if (!isPlaying || gameOver) return;

    if (array[currentIndex] !== "") {
      const newArray = [...array];
      newArray[currentIndex] = "";
      setArray(newArray);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-red-50 to-red-100">
        <h2 className="text-2xl font-bold text-center text-red-800">
          Sushi Array Index Master
        </h2>
        {!isPlaying && !gameOver && (
          <button
            onClick={startGame}
            className="mt-4 mx-auto block px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Start Game
          </button>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Game Stats */}
        <div className="flex justify-between items-center px-4">
          <div className="flex items-center gap-2">
            <span className="font-bold">Score: {score}</span>
            {streak > 0 && (
              <span className="text-orange-500 font-bold">
                Streak: 🔥 x{streak}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold">Time:</span>
            <span
              className={`font-bold ${timeLeft < 10 ? "text-red-600" : ""}`}
            >
              {timeLeft}s
            </span>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(lives)].map((_, i) => (
              <span key={i} className="text-red-500">
                ❤️
              </span>
            ))}
          </div>
        </div>

        {/* Target Display */}
        {targetIndex !== null && isPlaying && !gameOver && (
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-lg">Place this sushi:</div>
            <div className="text-3xl">{targetSushi.emoji}</div>
            <div className="text-xl font-bold text-red-600">
              at index [{targetIndex}]
            </div>
          </div>
        )}

        {/* Message Display */}
        <div className="text-center text-lg font-medium text-gray-700">
          {message}
        </div>

        {/* Conveyor Belt */}
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={moveLeft}
            disabled={!isPlaying || gameOver}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
          >
            ⬅️
          </button>

          <div className="space-y-2">
            {/* Sushi Boxes */}
            <div className="flex gap-2">
              {array.map((item, index) => (
                <div
                  key={index}
                  className={`w-20 h-20 border-2 rounded-lg flex items-center justify-center text-center
                    ${
                      index === currentIndex
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200"
                    }
                    ${index === targetIndex ? "bg-yellow-50" : ""}
                    ${!isPlaying ? "opacity-50" : ""}
                    transition-all duration-200`}
                >
                  {item ? (
                    <div className="text-3xl">{item.emoji}</div>
                  ) : (
                    <div className="text-sm text-gray-400">Empty</div>
                  )}
                </div>
              ))}
            </div>

            {/* Index Numbers */}
            <div className="flex gap-2">
              {array.map((_, index) => (
                <div
                  key={`index-${index}`}
                  className={`w-20 h-8 flex items-center justify-center font-mono font-bold 
                    ${index === currentIndex ? "text-red-600" : "text-gray-600"}
                    ${index === targetIndex ? "text-blue-600" : ""}
                  `}
                >
                  [{index}]
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={moveRight}
            disabled={!isPlaying || gameOver}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
          >
            ➡️
          </button>
        </div>

        {/* Game Controls */}
        <div className="flex justify-center gap-4">
          <button
            onClick={placeSushi}
            disabled={!isPlaying || gameOver}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50 transition-colors"
          >
            Place Sushi
          </button>
          <button
            onClick={removeSushi}
            disabled={!isPlaying || gameOver}
            className="px-6 py-2 border border-gray-200 hover:bg-gray-50 rounded-lg disabled:opacity-50 transition-colors"
          >
            Remove Sushi
          </button>
        </div>

        {/* Game Over Screen */}
        {gameOver && (
          <div className="text-center p-6 bg-red-50 rounded-lg">
            <h3 className="text-2xl font-bold text-red-800 mb-4">Game Over!</h3>
            <p className="text-lg mb-4">Final Score: {score}</p>
            <button
              onClick={startGame}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SushiGame;
