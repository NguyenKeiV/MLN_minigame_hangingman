import React, { useState, useEffect } from 'react';
import { RotateCcw, Lightbulb } from 'lucide-react';

const SECRET_WORD = 'Lão Tử';
const MAX_WRONG_GUESSES = 6;

// Hints for the game
const HINTS = [
  'Nguyên lý "Vô vi": Sống thuận theo tự nhiên, không cưỡng cầu, hành động hài hòa.',
  'Tư tưởng "Đạo": Xem Đạo là nguyên lý tối cao, vô hình, sinh ra và chi phối vạn vật.',
  'Đối trọng với Nho giáo: Trong khi Khổng Tử nhấn mạnh lễ nghi và trật tự xã hội, người này lại đề cao sự tự nhiên và tự do nội tâm.',
  'Triết lý giản dị: Đề cao sự khiêm nhường, ít ham muốn, sống thanh tịnh và hòa hợp.',
  'Người sáng lập Đạo gia: Tác giả của Đạo Đức Kinh, tác phẩm kinh điển triết học Trung Hoa.'
];

// Vietnamese alphabet including common letters
const VIETNAMESE_ALPHABET = [
  'A', 'B', 'C', 'D', 'E', 'G', 'H', 'I', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'Y'
];

// Function to normalize Vietnamese characters for comparison
const normalizeVietnamese = (str: string): string => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
};

// Function to check if a character matches (ignoring diacritics)
const characterMatches = (char1: string, char2: string): boolean => {
  return normalizeVietnamese(char1) === normalizeVietnamese(char2);
};

interface HangmanDrawingProps {
  wrongGuesses: number;
}

const HangmanDrawing: React.FC<HangmanDrawingProps> = ({ wrongGuesses }) => {
  return (
    <div className="flex justify-center mb-8">
      <svg width="200" height="250" className="border-2 border-gray-300 rounded-lg bg-gray-50">
        {/* Gallows base */}
        <line x1="10" y1="230" x2="100" y2="230" stroke="#8B4513" strokeWidth="4" />
        {/* Gallows pole */}
        <line x1="30" y1="230" x2="30" y2="20" stroke="#8B4513" strokeWidth="4" />
        {/* Gallows top */}
        <line x1="30" y1="20" x2="120" y2="20" stroke="#8B4513" strokeWidth="4" />
        {/* Noose */}
        <line x1="120" y1="20" x2="120" y2="50" stroke="#8B4513" strokeWidth="3" />
        
        {/* Head */}
        {wrongGuesses >= 1 && (
          <circle cx="120" cy="70" r="20" stroke="#FF6B6B" strokeWidth="3" fill="none" />
        )}
        
        {/* Body */}
        {wrongGuesses >= 2 && (
          <line x1="120" y1="90" x2="120" y2="180" stroke="#FF6B6B" strokeWidth="3" />
        )}
        
        {/* Left arm */}
        {wrongGuesses >= 3 && (
          <line x1="120" y1="120" x2="80" y2="160" stroke="#FF6B6B" strokeWidth="3" />
        )}
        
        {/* Right arm */}
        {wrongGuesses >= 4 && (
          <line x1="120" y1="120" x2="160" y2="160" stroke="#FF6B6B" strokeWidth="3" />
        )}
        
        {/* Left leg */}
        {wrongGuesses >= 5 && (
          <line x1="120" y1="180" x2="80" y2="220" stroke="#FF6B6B" strokeWidth="3" />
        )}
        
        {/* Right leg */}
        {wrongGuesses >= 6 && (
          <line x1="120" y1="180" x2="160" y2="220" stroke="#FF6B6B" strokeWidth="3" />
        )}
        
        {/* Face (eyes and mouth) when game is over */}
        {wrongGuesses >= 6 && (
          <>
            <circle cx="110" cy="65" r="2" fill="#FF6B6B" />
            <circle cx="130" cy="65" r="2" fill="#FF6B6B" />
            <path d="M 110 75 Q 120 85 130 75" stroke="#FF6B6B" strokeWidth="2" fill="none" />
          </>
        )}
      </svg>
    </div>
  );
};

function App() {
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [usedHints, setUsedHints] = useState<number[]>([]);

  // Get display word with guessed letters revealed
  const getDisplayWord = (): string => {
    return SECRET_WORD.split('').map(char => {
      if (char === ' ') return ' ';
      const isGuessed = guessedLetters.some(guessed => characterMatches(guessed, char));
      return isGuessed ? char : '_';
    }).join(' ');
  };

  // Handle letter guess
  const guessLetter = (letter: string) => {
    if (guessedLetters.includes(letter) || gameStatus !== 'playing') return;

    const newGuessedLetters = [...guessedLetters, letter];
    setGuessedLetters(newGuessedLetters);

    // Check if letter is in the word
    const isCorrect = SECRET_WORD.split('').some(char => characterMatches(char, letter));
    
    if (!isCorrect) {
      setWrongGuesses(prev => {
        const newWrongGuesses = prev + 1;
        
        return newWrongGuesses;
      });
      
      // Add a new hint when making a wrong guess (if hints are available)
      if (usedHints.length < HINTS.length) {
        const availableHints = HINTS.map((_, index) => index).filter(index => !usedHints.includes(index));
        if (availableHints.length > 0) {
          const randomHintIndex = availableHints[Math.floor(Math.random() * availableHints.length)];
          setUsedHints(prev => [...prev, randomHintIndex]);
        }
      }
    }
  };

  // Check win/lose conditions
  useEffect(() => {
    const allLettersGuessed = SECRET_WORD.split('').every(char => {
      if (char === ' ') return true;
      return guessedLetters.some(guessed => characterMatches(guessed, char));
    });

    if (allLettersGuessed) {
      setGameStatus('won');
    } else if (wrongGuesses >= MAX_WRONG_GUESSES) {
      setGameStatus('lost');
    }
  }, [guessedLetters, wrongGuesses]);

  // Reset game
  const resetGame = () => {
    setGuessedLetters([]);
    setWrongGuesses(0);
    setGameStatus('playing');
    setUsedHints([]);
  };

  // Get button style based on letter state
  const getLetterButtonStyle = (letter: string) => {
    const isGuessed = guessedLetters.includes(letter);
    if (!isGuessed) {
      return 'bg-blue-500 hover:bg-blue-600 text-white';
    }
    
    const isCorrect = SECRET_WORD.split('').some(char => characterMatches(char, letter));
    return isCorrect 
      ? 'bg-green-500 text-white cursor-not-allowed' 
      : 'bg-red-500 text-white cursor-not-allowed';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Game Đoán Chữ</h1>
          <p className="text-lg text-gray-600">Đoán từ bí mật để thắng game!</p>
        </div>

        {/* Main Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Game Status and Hangman */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-6">
                <div className="text-sm text-gray-500 mb-2">Số lần đoán sai: {wrongGuesses}/{MAX_WRONG_GUESSES}</div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-red-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(wrongGuesses / MAX_WRONG_GUESSES) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Hangman Drawing */}
              <HangmanDrawing wrongGuesses={wrongGuesses} />

              {/* Word Display */}
              <div className="text-center mb-8">
                <div className="text-4xl font-mono font-bold text-gray-800 tracking-widest mb-4">
                  {getDisplayWord()}
                </div>
                <div className="text-sm text-gray-500">
                  Từ bí mật có {SECRET_WORD.replace(' ', '').length} chữ cái
                </div>
              </div>

              {/* Game Status Messages */}
              {gameStatus === 'won' && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-center mb-6">
                  <div className="text-xl font-bold">🎉 Chúc mừng! Bạn đã thắng!</div>
                  <div className="text-sm mt-1">Bạn đã đoán đúng từ: <strong>{SECRET_WORD}</strong></div>
                </div>
              )}

              {gameStatus === 'lost' && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center mb-6">
                  <div className="text-xl font-bold">😞 Bạn đã thua!</div>
                  <div className="text-sm mt-1">Từ đúng là: <strong>{SECRET_WORD}</strong></div>
                </div>
              )}

              {/* Hint Display */}
              {usedHints.length > 0 && gameStatus === 'playing' && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div className="w-full">
                      <div className="font-semibold text-sm mb-2">💡 Gợi ý ({usedHints.length}/{HINTS.length}):</div>
                      <div className="space-y-2">
                        {usedHints.map((hintIndex, index) => (
                          <div key={hintIndex} className="text-sm">
                            <span className="font-medium">{index + 1}.</span> {HINTS[hintIndex]}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Controls */}
          <div className="space-y-6">
            {/* Virtual Keyboard */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Chọn chữ cái</h3>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {VIETNAMESE_ALPHABET.map((letter) => (
                  <button
                    key={letter}
                    onClick={() => guessLetter(letter)}
                    disabled={guessedLetters.includes(letter) || gameStatus !== 'playing'}
                    className={`
                      px-2 py-2 rounded-lg font-semibold text-sm transition-all duration-200 transform hover:scale-105
                      ${getLetterButtonStyle(letter)}
                      ${gameStatus !== 'playing' ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>

            {/* Guessed Letters Display */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Các chữ cái đã đoán:</h3>
              <div className="flex flex-wrap gap-2">
                {guessedLetters.length === 0 ? (
                  <span className="text-gray-400 italic text-sm">Chưa có chữ cái nào được đoán</span>
                ) : (
                  guessedLetters.map((letter, index) => {
                    const isCorrect = SECRET_WORD.split('').some(char => characterMatches(char, letter));
                    return (
                      <span
                        key={index}
                        className={`
                          px-3 py-1 rounded-full text-sm font-semibold
                          ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                        `}
                      >
                        {letter}
                      </span>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <div className="text-center">
          <button
            onClick={resetGame}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 inline-flex items-center gap-2"
          >
            <RotateCcw size={20} />
            Chơi lại
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>Game Hangman | Hỗ trợ tiếng Việt đầy đủ</p>
        </div>
      </div>
    </div>
  );
}

export default App;