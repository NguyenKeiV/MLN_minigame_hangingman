import React, { useState, useEffect } from "react";
import {
  RotateCcw,
  Lightbulb,
  Play,
  SkipForward,
  Trophy,
  Sparkles,
  Heart,
} from "lucide-react";

const MAX_WRONG_GUESSES = 6;

const QUESTIONS = [
  {
    word: "Hư vô",
    hints: [
      "Chủ nghĩa triết học cho rằng cuộc sống không có ý nghĩa nội tại.",
      'Từ tiếng Latin "nihil" nghĩa là "không có gì".',
      "Tin rằng không có giá trị đạo đức tuyệt đối nào.",
      "Xuất hiện mạnh ở Nga thế kỷ 19.",
      "Cho rằng mọi thứ đều vô nghĩa, không có mục đích.",
    ],
  },
  {
    word: "Lão Tử",
    hints: [
      "Triết gia Trung Quốc cổ đại, người sáng lập Đạo gia.",
      'Tác giả cuốn "Đạo Đức Kinh" nổi tiếng.',
      'Dạy về "Vô vi" - sống thuận theo tự nhiên.',
      'Tin vào "Đạo" - nguyên lý tối cao của vũ trụ.',
      "Trái ngược với Khổng Tử về cách sống.",
    ],
  },
  {
    word: "Tự do",
    hints: [
      "Khả năng tự quyết định và hành động theo ý muốn.",
      "Không bị ràng buộc hay cưỡng ép.",
      "Một giá trị cốt lõi trong triết học hiện sinh.",
      'Theo Sartre: con người "bị kết án" phải có nó.',
      "Đi kèm với trách nhiệm cá nhân.",
    ],
  },
  
  {
    word: "Hiện sinh",
    hints: [
      "Triết lý tập trung vào sự tồn tại cá nhân.",
      "Nhấn mạnh tự do, trách nhiệm và lựa chọn.",
      "Con người tự tạo ra bản chất của mình.",
      "Sartre và Camus là những đại diện nổi tiếng.",
      "Quan tâm đến cảm giác lo âu và tuyệt vọng.",
    ],
  },
  {
    word: "Giản dị",
    hints: [
      "Sống đơn giản, không phức tạp.",
      "Ít ham muốn vật chất.",
      "Lão Tử và Diogenes đề cao lối sống này.",
      "Tránh xa sự xa hoa và phô trương.",
      "Hạnh phúc từ những điều nhỏ nhặt.",
    ],
  },
];

const VIETNAMESE_ALPHABET = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "G",
  "H",
  "I",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "X",
  "Y",
];

const normalizeVietnamese = (str: string): string =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const characterMatches = (char1: string, char2: string): boolean =>
  normalizeVietnamese(char1) === normalizeVietnamese(char2);

const ParticleEffect: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  if (!isActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-bounce"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        >
          <Sparkles
            size={16}
            className="text-yellow-400 animate-pulse"
            style={{
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        </div>
      ))}
    </div>
  );
};

const HangmanDrawing: React.FC<{ wrongGuesses: number }> = ({
  wrongGuesses,
}) => (
  <div className="flex justify-center mb-8 relative">
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-pink-300 to-purple-300 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
      <svg
        width="200"
        height="250"
        className="relative rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-xl"
      >
        {/* Gallows with gradient */}
        <defs>
          <linearGradient id="woodGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: "#8B4513", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#654321", stopOpacity: 1 }}
            />
          </linearGradient>
        </defs>

        <line
          x1="10"
          y1="230"
          x2="100"
          y2="230"
          stroke="url(#woodGradient)"
          strokeWidth="4"
        />
        <line
          x1="30"
          y1="230"
          x2="30"
          y2="20"
          stroke="url(#woodGradient)"
          strokeWidth="4"
        />
        <line
          x1="30"
          y1="20"
          x2="120"
          y2="20"
          stroke="url(#woodGradient)"
          strokeWidth="4"
        />
        <line
          x1="120"
          y1="20"
          x2="120"
          y2="50"
          stroke="url(#woodGradient)"
          strokeWidth="3"
        />

        {/* Animated body parts */}
        {wrongGuesses >= 1 && (
          <g className="animate-pulse">
            <circle
              cx="120"
              cy="70"
              r="20"
              stroke="#EF4444"
              strokeWidth="3"
              fill="none"
              className="drop-shadow-md"
            />
          </g>
        )}
        {wrongGuesses >= 2 && (
          <line
            x1="120"
            y1="90"
            x2="120"
            y2="140"
            stroke="#EF4444"
            strokeWidth="3"
            className="animate-pulse drop-shadow-md"
          />
        )}
        {wrongGuesses >= 3 && (
          <line
            x1="120"
            y1="120"
            x2="80"
            y2="160"
            stroke="#EF4444"
            strokeWidth="3"
            className={`drop-shadow-md ${
              wrongGuesses === 3 ? "animate-pulse" : ""
            }`}
          />
        )}
        {wrongGuesses >= 4 && (
          <line
            x1="120"
            y1="120"
            x2="160"
            y2="160"
            stroke="#EF4444"
            strokeWidth="3"
            className={`drop-shadow-md ${
              wrongGuesses === 4 ? "animate-pulse" : ""
            }`}
          />
        )}
        {wrongGuesses >= 5 && (
          <line
            x1="120"
            y1="140"
            x2="80"
            y2="180"
            stroke="#EF4444"
            strokeWidth="3"
            className={`drop-shadow-md ${
              wrongGuesses === 5 ? "animate-pulse" : ""
            }`}
          />
        )}
        {wrongGuesses >= 6 && (
          <>
            <line
              x1="120"
              y1="140"
              x2="160"
              y2="180"
              stroke="#EF4444"
              strokeWidth="3"
              className="drop-shadow-md animate-pulse"
            />
            {/* Sad face with animation */}
            <g className="animate-bounce" style={{ animationDuration: "2s" }}>
              <circle
                cx="110"
                cy="65"
                r="3"
                fill="#EF4444"
                className="animate-pulse"
              />
              <circle
                cx="130"
                cy="65"
                r="3"
                fill="#EF4444"
                className="animate-pulse"
              />
              <path
                d="M 110 80 Q 120 70 130 80"
                stroke="#EF4444"
                strokeWidth="2"
                fill="none"
              />
            </g>
          </>
        )}
      </svg>
    </div>
  </div>
);

const IntroVideo: React.FC<{ onStartGame: () => void }> = ({ onStartGame }) => {
  const [showStartButton, setShowStartButton] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowStartButton(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleVideoError = () => {
    setVideoError(true);
    setShowStartButton(true);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 z-50 flex items-center justify-center">
      {!videoError ? (
        <div className="relative w-full h-full">
           <iframe
        className="absolute top-0 left-0 w-full h-full z-50"
        src="https://www.youtube.com/embed/hd4vRbjMyKE?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1"
        title="Intro Video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        onLoad={() => {
          setTimeout(() => {
            setShowStartButton(true);
          }, 10000);
        }}
        onError={handleVideoError}
      />

          <div className="absolute inset-0">
  <div className="absolute top-1/2 right-4 -translate-y-1/2 z-[9999]">
    {showStartButton && (
      <button
        onClick={onStartGame}
        className="text-white text-opacity-80 hover:text-opacity-100 flex items-center gap-2 text-sm transition-all duration-300 backdrop-blur-sm bg-black bg-opacity-30 px-6 py-3 rounded-full hover:scale-110 hover:shadow-2xl"
      >
        <SkipForward size={16} />
        Bỏ qua intro
      </button>
    )}
  </div>
</div>

        </div>
      ) : (
        <div className="text-center text-white p-8 relative">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-40 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>
          </div>

          <div className="mb-8 animate-fade-in-up">
            <h1 className="text-7xl font-extrabold mb-6 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
              🎮 Game Đoán Chữ
            </h1>
            <p className="text-2xl text-gray-200 mb-8 animate-fade-in-up animation-delay-200">
              Thử thách trí tuệ của bạn!
            </p>
            <div className="text-gray-300 text-sm mb-8 animate-fade-in-up animation-delay-400">
              (Không thể tải video intro)
            </div>
          </div>
          <button
            onClick={onStartGame}
            className="relative bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold px-12 py-4 rounded-full transition-all duration-300 transform hover:scale-110 inline-flex items-center gap-3 shadow-2xl animate-bounce hover:shadow-pink-500/50"
          >
            <Play size={24} />
            Bắt đầu chơi
            <div className="absolute inset-0 rounded-full bg-white opacity-20 animate-ping"></div>
          </button>
        </div>
      )}
    </div>
  );
};

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">(
    "playing"
  );
  const [usedHints, setUsedHints] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [showLetterAnimation, setShowLetterAnimation] = useState<string | null>(
    null
  );
  const [streak, setStreak] = useState(0);

  const SECRET_WORD = QUESTIONS[currentQuestion].word;
  const HINTS = QUESTIONS[currentQuestion].hints;

  const getDisplayWord = () =>
    SECRET_WORD.split("")
      .map((char) =>
        char === " "
          ? " "
          : guessedLetters.some((g) => characterMatches(g, char))
          ? char
          : "_"
      )
      .join(" ");

  const guessLetter = (letter: string) => {
    if (guessedLetters.includes(letter) || gameStatus !== "playing") return;

    setGuessedLetters([...guessedLetters, letter]);
    setShowLetterAnimation(letter);
    setTimeout(() => setShowLetterAnimation(null), 1000);

    const isCorrect = SECRET_WORD.split("").some((c) =>
      characterMatches(c, letter)
    );

    if (!isCorrect) {
      setWrongGuesses((prev) => prev + 1);
      if (usedHints.length < HINTS.length) {
        const available = HINTS.map((_, i) => i).filter(
          (i) => !usedHints.includes(i)
        );
        if (available.length > 0) {
          const randomHint =
            available[Math.floor(Math.random() * available.length)];
          setUsedHints((prev) => [...prev, randomHint]);
        }
      }
    }
  };

  useEffect(() => {
    if (!gameStarted) return;

    const allGuessed = SECRET_WORD.split("").every(
      (char) =>
        char === " " || guessedLetters.some((g) => characterMatches(g, char))
    );
    if (allGuessed) {
      setGameStatus("won");
      setScore((prev) => prev + 10);
      setStreak((prev) => prev + 1);
    } else if (wrongGuesses >= MAX_WRONG_GUESSES) {
      setGameStatus("lost");
      setStreak(0);
    }
  }, [guessedLetters, wrongGuesses, gameStarted, SECRET_WORD]);

  const resetGame = () => {
    setGuessedLetters([]);
    setWrongGuesses(0);
    setGameStatus("playing");
    setUsedHints([]);
  };

  const nextQuestion = () => {
    const nextIndex = (currentQuestion + 1) % QUESTIONS.length;
    setCurrentQuestion(nextIndex);
    resetGame();
  };

  const randomQuestion = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * QUESTIONS.length);
    } while (newIndex === currentQuestion && QUESTIONS.length > 1);
    setCurrentQuestion(newIndex);
    resetGame();
  };

  const startGame = () => {
    setGameStarted(true);
    randomQuestion();
  };

  const getLetterButtonStyle = (letter: string) => {
    if (!guessedLetters.includes(letter))
      return "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl text-white";
    return SECRET_WORD.split("").some((c) => characterMatches(c, letter))
      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white cursor-not-allowed shadow-green-500/50"
      : "bg-gradient-to-r from-red-500 to-pink-600 text-white cursor-not-allowed shadow-red-500/50";
  };

  if (!gameStarted) {
    return <IntroVideo onStartGame={startGame} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 py-10 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-20 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-10 animate-fade-in-down">
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 drop-shadow-2xl animate-gradient mb-4">
            🎮 Game Đoán Chữ
          </h1>
          <p className="text-xl text-gray-200 mt-2 font-light">
            Đoán từ bí mật để chiến thắng!
          </p>
          <div className="mt-4 flex justify-center gap-4 flex-wrap">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg transform hover:scale-110 transition-transform">
              <Trophy size={20} className="inline mr-2" />
              Điểm: {score}
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg transform hover:scale-110 transition-transform">
              📍 Câu {currentQuestion + 1}/{QUESTIONS.length}
            </div>
            {streak > 0 && (
              <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg transform hover:scale-110 transition-transform animate-bounce">
                🔥 Chuỗi: {streak}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white border-opacity-20 transform hover:scale-[1.02] transition-transform duration-300">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                {[...Array(MAX_WRONG_GUESSES - wrongGuesses)].map((_, i) => (
                  <Heart
                    key={i}
                    size={24}
                    className="text-red-500 fill-red-500 animate-pulse"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
                {[...Array(wrongGuesses)].map((_, i) => (
                  <Heart
                    key={i + MAX_WRONG_GUESSES}
                    size={24}
                    className="text-gray-400"
                  />
                ))}
              </div>
              <div className="w-full bg-gray-700 bg-opacity-50 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-red-500 to-pink-600 h-3 rounded-full transition-all duration-500 ease-out shadow-lg"
                  style={{
                    width: `${(wrongGuesses / MAX_WRONG_GUESSES) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <HangmanDrawing wrongGuesses={wrongGuesses} />

            <div className="text-center mb-8">
              <div className="text-6xl font-mono font-extrabold text-white tracking-widest mb-3 select-none">
                {getDisplayWord()}
              </div>
              <p className="text-sm text-gray-300">
                Từ bí mật có {SECRET_WORD.replace(/ /g, "").length} chữ cái
              </p>
            </div>

            {gameStatus === "won" && (
              <div className="bg-green-900 bg-opacity-80 border-l-4 border-green-400 text-green-300 px-6 py-4 rounded-lg mb-6 shadow-lg relative overflow-hidden">
                <ParticleEffect isActive={true} />
                <p className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Sparkles size={24} /> 🎉 Chúc mừng! Bạn đã đoán đúng từ:{" "}
                  <strong className="underline decoration-yellow-400">
                    {SECRET_WORD}
                  </strong>
                </p>
                <button
                  onClick={randomQuestion}
                  className="mt-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg transition-all duration-300 shadow-lg inline-flex items-center gap-2"
                >
                  Câu hỏi tiếp theo <SkipForward size={20} />
                </button>
              </div>
            )}

            {gameStatus === "lost" && (
              <div className="bg-red-900 bg-opacity-80 border-l-4 border-red-500 text-red-300 px-6 py-4 rounded-lg mb-6 shadow-lg">
                <p className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Heart size={24} /> 😞 Rất tiếc! Từ đúng là:{" "}
                  <strong className="underline decoration-red-400">
                    {SECRET_WORD}
                  </strong>
                </p>
                <button
                  onClick={randomQuestion}
                  className="mt-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-lg transition-all duration-300 shadow-lg inline-flex items-center gap-2"
                >
                  Thử câu hỏi khác 🔄
                </button>
              </div>
            )}

            {usedHints.length > 0 && gameStatus === "playing" && (
              <div className="bg-yellow-900 bg-opacity-80 border-l-4 border-yellow-400 text-yellow-300 px-6 py-4 rounded-lg mb-6 shadow-lg">
                <div className="flex items-start gap-3">
                  <Lightbulb size={24} />
                  <div>
                    <p className="font-semibold text-sm mb-2">
                      💡 Gợi ý ({usedHints.length}/{HINTS.length}):
                    </p>
                    {usedHints.map((i, idx) => (
                      <p key={i} className="text-sm">
                        <span className="font-medium">{idx + 1}.</span>{" "}
                        {HINTS[i]}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-3xl shadow-xl p-6 border border-white border-opacity-20">
              <h3 className="text-white text-lg font-semibold mb-4">
                Chọn chữ cái
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {VIETNAMESE_ALPHABET.map((letter) => (
                  <button
                    key={letter}
                    onClick={() => guessLetter(letter)}
                    disabled={
                      guessedLetters.includes(letter) ||
                      gameStatus !== "playing"
                    }
                    className={`px-4 py-3 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-110 select-none ${getLetterButtonStyle(
                      letter
                    )} ${
                      gameStatus !== "playing"
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {letter}
                    {showLetterAnimation === letter && (
                      <Sparkles
                        size={18}
                        className="inline ml-1 animate-pulse text-yellow-400"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-3xl shadow-xl p-6 border border-white border-opacity-20">
              <h3 className="text-white text-lg font-semibold mb-4">
                Chữ cái đã đoán
              </h3>
              <div className="flex flex-wrap gap-3 text-white">
                {guessedLetters.length === 0 ? (
                  <span className="italic text-sm opacity-70">
                    Chưa có chữ cái nào
                  </span>
                ) : (
                  guessedLetters.map((letter, idx) => {
                    const correct = SECRET_WORD.split("").some((c) =>
                      characterMatches(c, letter)
                    );
                    return (
                      <span
                        key={idx}
                        className={`px-4 py-1 rounded-full text-lg font-semibold select-none ${
                          correct
                            ? "bg-green-600 bg-opacity-80"
                            : "bg-red-600 bg-opacity-80"
                        }`}
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

        <div className="text-center mt-12 space-x-6">
          <button
            onClick={resetGame}
            disabled={gameStatus === "playing"}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-10 py-3 rounded-3xl transition-all duration-300 inline-flex items-center gap-3 shadow-lg transform hover:scale-105"
          >
            <RotateCcw size={20} />
            Chơi lại câu này
          </button>
          <button
            onClick={randomQuestion}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-10 py-3 rounded-3xl transition-all duration-300 inline-flex items-center gap-3 shadow-lg transform hover:scale-105"
          >
            🔀 Câu ngẫu nhiên
          </button>
          <button
            onClick={() => setGameStarted(false)}
            className="bg-gray-700 hover:bg-gray-800 text-white font-semibold px-10 py-3 rounded-3xl transition-all duration-300 inline-flex items-center gap-3 shadow-lg transform hover:scale-105"
          >
            🎬 Xem lại intro
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
