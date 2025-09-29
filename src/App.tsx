import React, { useState, useEffect } from 'react';
import { RotateCcw, Lightbulb, Play, SkipForward } from 'lucide-react';

const SECRET_WORD = 'Lão Tử';
const MAX_WRONG_GUESSES = 6;

const HINTS = [
  'Nguyên lý "Vô vi": Sống thuận theo tự nhiên, không cưỡng cầu, hành động hài hòa.',
  'Tư tưởng "Đạo": Xem Đạo là nguyên lý tối cao, vô hình, sinh ra và chi phối vạn vật.',
  'Đối trọng với Nho giáo: Khổng Tử nhấn mạnh lễ nghi và trật tự xã hội, Lão Tử đề cao sự tự nhiên và tự do nội tâm.',
  'Triết lý giản dị: Đề cao sự khiêm nhường, ít ham muốn, sống thanh tịnh và hòa hợp.',
  'Người sáng lập Đạo gia: Tác giả Đạo Đức Kinh, tác phẩm kinh điển triết học Trung Hoa.'
];

const VIETNAMESE_ALPHABET = [
  'A', 'B', 'C', 'D', 'E', 'G', 'H', 'I', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'Y'
];

const normalizeVietnamese = (str: string): string =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const characterMatches = (char1: string, char2: string): boolean =>
  normalizeVietnamese(char1) === normalizeVietnamese(char2);

const HangmanDrawing: React.FC<{ wrongGuesses: number }> = ({ wrongGuesses }) => (
  <div className="flex justify-center mb-8">
    <svg width="200" height="250" className="rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 shadow-inner">
      <line x1="10" y1="230" x2="100" y2="230" stroke="#8B4513" strokeWidth="4" />
      <line x1="30" y1="230" x2="30" y2="20" stroke="#8B4513" strokeWidth="4" />
      <line x1="30" y1="20" x2="120" y2="20" stroke="#8B4513" strokeWidth="4" />
      <line x1="120" y1="20" x2="120" y2="50" stroke="#8B4513" strokeWidth="3" />

      {wrongGuesses >= 1 && <circle cx="120" cy="70" r="20" stroke="#EF4444" strokeWidth="3" fill="none" />}
      {wrongGuesses >= 2 && <line x1="120" y1="90" x2="120" y2="180" stroke="#EF4444" strokeWidth="3" />}
      {wrongGuesses >= 3 && <line x1="120" y1="120" x2="80" y2="160" stroke="#EF4444" strokeWidth="3" />}
      {wrongGuesses >= 4 && <line x1="120" y1="120" x2="160" y2="160" stroke="#EF4444" strokeWidth="3" />}
      {wrongGuesses >= 5 && <line x1="120" y1="180" x2="80" y2="220" stroke="#EF4444" strokeWidth="3" />}
      {wrongGuesses >= 6 && (
        <>
          <line x1="120" y1="180" x2="160" y2="220" stroke="#EF4444" strokeWidth="3" />
          <circle cx="110" cy="65" r="2" fill="#EF4444" />
          <circle cx="130" cy="65" r="2" fill="#EF4444" />
          <path d="M 110 75 Q 120 85 130 75" stroke="#EF4444" strokeWidth="2" fill="none" />
        </>
      )}
    </svg>
  </div>
);

const IntroVideo: React.FC<{ onStartGame: () => void }> = ({ onStartGame }) => {
  const [showStartButton, setShowStartButton] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    // Hiển thị nút bắt đầu sau 3 giây (để người dùng có thể bỏ qua nếu muốn)
    const timer = setTimeout(() => {
      setShowStartButton(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleVideoEnd = () => {
    setShowStartButton(true);
  };

  const handleVideoError = () => {
    setVideoError(true);
    setShowStartButton(true);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {!videoError ? (
        <div className="relative w-full h-full">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/hd4vRbjMyKE?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1"
            title="Intro Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => {
              // Tự động hiển thị nút sau thời gian dự kiến của video (khoảng 10 giây)
              setTimeout(() => {
                setShowStartButton(true);
              }, 10000);
            }}
            onError={handleVideoError}
          />
          
          {/* Overlay với nút điều khiển */}
          <div className="absolute inset-0">
            {/* Nút bắt đầu chơi game - bên phải */}
            <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
              {showStartButton && (
                <button
                  onClick={onStartGame}
                  className="bg-indigo-600 bg-opacity-80 hover:bg-indigo-700 hover:bg-opacity-90 text-white font-bold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-3 shadow-2xl text-xl backdrop-blur-sm animate-pulse"
                  style={{
                    animation: 'fadeInOut 2s ease-in-out infinite'
                  }}
                >
                  <Play size={24} />
                  Bắt đầu chơi game
                </button>
              )}
            </div>
            
            {/* Nút bỏ qua intro - dưới cùng giữa */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
              {showStartButton && (
                <button
                  onClick={onStartGame}
                  className="text-white text-opacity-80 hover:text-opacity-100 flex items-center gap-2 text-sm transition-all duration-200 backdrop-blur-sm bg-black bg-opacity-30 px-4 py-2 rounded-full"
                >
                  <SkipForward size={16} />
                  Bỏ qua intro
                </button>
              )}
            </div>
          </div>
          
          {/* CSS Animation cho hiệu ứng mờ rõ */}
          <style jsx>{`
            @keyframes fadeInOut {
              0%, 100% { opacity: 0.7; }
              50% { opacity: 1; }
            }
          `}</style>
        </div>
      ) : (
        // Fallback nếu video không load được
        <div className="text-center text-white p-8">
          <div className="mb-8">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              🎮 Game Đoán Chữ
            </h1>
            <p className="text-xl text-gray-300 mb-8">Chào mừng bạn đến với trò chơi đoán từ!</p>
            <div className="text-gray-400 text-sm mb-8">
              (Không thể tải video intro)
            </div>
          </div>
          
          <button
            onClick={onStartGame}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-3 shadow-2xl text-xl mx-auto"
          >
            <Play size={24} />
            Bắt đầu chơi game
          </button>
        </div>
      )}
    </div>
  );
};

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [usedHints, setUsedHints] = useState<number[]>([]);

  const getDisplayWord = () =>
    SECRET_WORD.split('').map(char =>
      char === ' ' ? ' ' : guessedLetters.some(g => characterMatches(g, char)) ? char : '_'
    ).join(' ');

  const guessLetter = (letter: string) => {
    if (guessedLetters.includes(letter) || gameStatus !== 'playing') return;

    setGuessedLetters([...guessedLetters, letter]);
    const isCorrect = SECRET_WORD.split('').some(c => characterMatches(c, letter));

    if (!isCorrect) {
      setWrongGuesses(prev => prev + 1);
      if (usedHints.length < HINTS.length) {
        const available = HINTS.map((_, i) => i).filter(i => !usedHints.includes(i));
        if (available.length > 0) {
          const randomHint = available[Math.floor(Math.random() * available.length)];
          setUsedHints(prev => [...prev, randomHint]);
        }
      }
    }
  };

  useEffect(() => {
    if (!gameStarted) return;
    
    const allGuessed = SECRET_WORD.split('').every(char =>
      char === ' ' || guessedLetters.some(g => characterMatches(g, char))
    );
    if (allGuessed) setGameStatus('won');
    else if (wrongGuesses >= MAX_WRONG_GUESSES) setGameStatus('lost');
  }, [guessedLetters, wrongGuesses, gameStarted]);

  const resetGame = () => {
    setGuessedLetters([]);
    setWrongGuesses(0);
    setGameStatus('playing');
    setUsedHints([]);
  };

  const startGame = () => {
    setGameStarted(true);
    resetGame();
  };

  const getLetterButtonStyle = (letter: string) => {
    if (!guessedLetters.includes(letter)) return 'bg-indigo-500 hover:bg-indigo-600 shadow text-white';
    return SECRET_WORD.split('').some(c => characterMatches(c, letter))
      ? 'bg-green-500 text-white cursor-not-allowed'
      : 'bg-red-500 text-white cursor-not-allowed';
  };

  if (!gameStarted) {
    return <IntroVideo onStartGame={startGame} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-indigo-700 drop-shadow">🎮 Game Đoán Chữ</h1>
          <p className="text-lg text-gray-600 mt-2">Đoán từ bí mật để chiến thắng!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500 mb-2">Số lần đoán sai: {wrongGuesses}/{MAX_WRONG_GUESSES}</p>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div className="bg-red-500 h-3 rounded-full transition-all duration-300" style={{ width: `${(wrongGuesses / MAX_WRONG_GUESSES) * 100}%` }}></div>
              </div>
            </div>

            <HangmanDrawing wrongGuesses={wrongGuesses} />

            <div className="text-center mb-8">
              <div className="text-5xl font-mono font-bold text-gray-800 tracking-widest mb-3">{getDisplayWord()}</div>
              <p className="text-sm text-gray-500">Từ bí mật có {SECRET_WORD.replace(' ', '').length} chữ cái</p>
            </div>

            {gameStatus === 'won' && (
              <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded mb-6">
                🎉 Chúc mừng! Bạn đã đoán đúng từ: <strong>{SECRET_WORD}</strong>
              </div>
            )}
            {gameStatus === 'lost' && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6">
                😞 Rất tiếc! Từ đúng là: <strong>{SECRET_WORD}</strong>
              </div>
            )}

            {usedHints.length > 0 && gameStatus === 'playing' && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-6">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-5 h-5 mt-1" />
                  <div>
                    <p className="font-semibold text-sm mb-1">💡 Gợi ý ({usedHints.length}/{HINTS.length}):</p>
                    {usedHints.map((i, idx) => (
                      <p key={i} className="text-sm"><span className="font-medium">{idx + 1}.</span> {HINTS[i]}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Chọn chữ cái</h3>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {VIETNAMESE_ALPHABET.map(letter => (
                  <button
                    key={letter}
                    onClick={() => guessLetter(letter)}
                    disabled={guessedLetters.includes(letter) || gameStatus !== 'playing'}
                    className={`px-3 py-2 rounded-lg font-bold text-sm transition-all duration-200 transform hover:scale-105 ${getLetterButtonStyle(letter)} ${gameStatus !== 'playing' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Chữ cái đã đoán</h3>
              <div className="flex flex-wrap gap-2">
                {guessedLetters.length === 0
                  ? <span className="text-gray-400 italic text-sm">Chưa có chữ cái nào</span>
                  : guessedLetters.map((letter, idx) => {
                      const correct = SECRET_WORD.split('').some(c => characterMatches(c, letter));
                      return (
                        <span key={idx} className={`px-3 py-1 rounded-full text-sm font-semibold ${correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {letter}
                        </span>
                      );
                    })}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-10 space-x-4">
          <button onClick={resetGame} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 inline-flex items-center gap-2 shadow-lg">
            <RotateCcw size={20} /> Chơi lại
          </button>
          <button 
            onClick={() => setGameStarted(false)} 
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 inline-flex items-center gap-2 shadow-lg"
          >
            🎬 Xem lại intro
          </button>
        </div>

        <p className="text-center mt-8 text-gray-500 text-sm">Game Hangman | Nguyễn Kỳ Vỹ</p>
      </div>
    </div>
  );
}

export default App;