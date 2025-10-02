import React, { useState, useEffect } from "react";
import { RotateCcw, Lightbulb, Play, SkipForward } from "lucide-react";

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
    word: "Bi quan",
    hints: [
      "Quan điểm cho rằng cuộc sống đầy đau khổ.",
      "Nhìn vào mặt xấu, tiêu cực của sự vật.",
      "Tin rằng khổ đau nhiều hơn hạnh phúc.",
      "Triết lý của Schopenhauer thuộc loại này.",
      "Trái ngược với lạc quan.",
    ],
  },
  {
    word: "Khổ đau",
    hints: [
      "Trạng thái đau khổ về thể xác hoặc tinh thần.",
      "Phật giáo xem đây là sự thật đầu tiên của cuộc đời.",
      "Một chủ đề chính trong triết học hiện sinh.",
      'Theo Schopenhauer: nguồn gốc từ "ý chí sống".',
      "Mọi người đều trải nghiệm trong cuộc sống.",
    ],
  },
  {
    word: "Ý nghĩa",
    hints: [
      "Giá trị, mục đích hoặc lý do tồn tại của một sự vật.",
      "Triết học hiện sinh tìm kiếm điều này trong cuộc sống.",
      "Chủ nghĩa hư vô cho rằng cuộc đời không có nó.",
      "Mỗi người phải tự tìm cho riêng mình.",
      'Câu hỏi: "Ý nghĩa của cuộc đời là gì?"',
    ],
  },
  {
    word: "Cô đơn",
    hints: [
      "Trạng thái một mình, thiếu kết nối với người khác.",
      "Cảm giác bị tách biệt khỏi thế giới xung quanh.",
      "Một chủ đề quan trọng trong triết học hiện sinh.",
      "Con người về bản chất luôn cảm thấy điều này.",
      "Có thể dẫn đến sự trống rỗng và tuyệt vọng.",
    ],
  },
  {
    word: "Chân lý",
    hints: [
      "Điều đúng đắn, không thể phủ nhận.",
      "Những gì phản ánh đúng thực tại.",
      "Triết học tìm kiếm điều này.",
      "Có thể là tuyệt đối hoặc tương đối.",
      "Đối lập với sai lầm và ảo tưởng.",
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
    word: "Vô thường",
    hints: [
      "Mọi thứ đều thay đổi, không gì là vĩnh cửu.",
      "Một khái niệm quan trọng trong Phật giáo.",
      "Không có gì tồn tại mãi mãi.",
      "Cuộc sống luôn biến động, không ổn định.",
      "Chấp nhận điều này giúp giảm đau khổ.",
    ],
  },
  {
    word: "Tuyệt vọng",
    hints: [
      "Mất hết hy vọng, cảm thấy vô vọng.",
      "Trạng thái tinh thần cực kỳ đau khổ.",
      "Có thể dẫn đến chủ nghĩa hư vô.",
      "Kierkegaard viết nhiều về trạng thái này.",
      "Cảm giác không còn đường ra, không thể thay đổi.",
    ],
  },
  {
    word: "Tĩnh tâm",
    hints: [
      "Trạng thái tâm hồn bình yên, không dao động.",
      "Mục tiêu của nhiều trường phái triết học Đông phương.",
      "Đạt được qua thiền định và tự suy ngẫm.",
      "Thoát khỏi ồn ào và lo âu.",
      "Tâm trí trong sáng, ổn định.",
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
  {
    word: "Bản chất",
    hints: [
      "Đặc tính cốt lõi, không thay đổi của sự vật.",
      "Cái làm nên sự vật là chính nó.",
      'Sartre: "Hiện hữu có trước ..."',
      "Con người không có bản chất cố định từ đầu.",
      "Ta tự tạo ra nó qua hành động.",
    ],
  },
  {
    word: "Lo âu",
    hints: [
      "Cảm giác bất an, sợ hãi không rõ nguyên nhân.",
      "Một trạng thái cơ bản của con người.",
      "Heidegger coi đây là cảm xúc quan trọng.",
      "Phát sinh khi đối mặt với tự do và cái chết.",
      "Khác với nỗi sợ có đối tượng cụ thể.",
    ],
  },
  {
    word: "Định mệnh",
    hints: [
      "Số phận được định sẵn, không thể thay đổi.",
      "Mọi sự việc đã được quyết định trước.",
      "Đối lập với tự do ý chí.",
      "Một số triết gia tin vào sự tồn tại của nó.",
      "Con người có thể chấp nhận hoặc chống lại nó.",
    ],
  },
  {
    word: "Đạo đức",
    hints: [
      "Các nguyên tắc phân biệt đúng sai, tốt xấu.",
      "Hướng dẫn hành vi của con người.",
      "Một nhánh chính của triết học.",
      "Có thể dựa trên lý trí hoặc cảm xúc.",
      "Kant và Mill nghiên cứu sâu về lĩnh vực này.",
    ],
  },
  {
    word: "Giác ngộ",
    hints: [
      "Đạt được trạng thái hiểu biết cao nhất.",
      "Thức tỉnh về bản chất thực tại.",
      "Mục tiêu cuối cùng trong Phật giáo.",
      "Thoát khỏi vô minh và ảo tưởng.",
      "Đức Phật đạt được điều này dưới cây bồ đề.",
    ],
  },
  {
    word: "Vị kỷ",
    hints: [
      "Chỉ quan tâm đến lợi ích bản thân.",
      "Hành động vì mục đích cá nhân.",
      "Đối lập với lòng vị tha.",
      "Một số triết gia cho đây là bản tính con người.",
      "Có thể dẫn đến hành vi phi đạo đức.",
    ],
  },
  {
    word: "Vị tha",
    hints: [
      "Quan tâm đến người khác nhiều hơn bản thân.",
      "Hành động vì lợi ích của người khác.",
      "Đối lập với chủ nghĩa vị kỷ.",
      "Một đức tính được đề cao trong nhiều tôn giáo.",
      "Hy sinh lợi ích cá nhân vì người khác.",
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

const HangmanDrawing: React.FC<{ wrongGuesses: number }> = ({
  wrongGuesses,
}) => (
  <div className="flex justify-center mb-8">
    <svg
      width="200"
      height="250"
      className="rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 shadow-inner"
    >
      <line
        x1="10"
        y1="230"
        x2="100"
        y2="230"
        stroke="#8B4513"
        strokeWidth="4"
      />
      <line x1="30" y1="230" x2="30" y2="20" stroke="#8B4513" strokeWidth="4" />
      <line x1="30" y1="20" x2="120" y2="20" stroke="#8B4513" strokeWidth="4" />
      <line
        x1="120"
        y1="20"
        x2="120"
        y2="50"
        stroke="#8B4513"
        strokeWidth="3"
      />

      {wrongGuesses >= 1 && (
        <circle
          cx="120"
          cy="70"
          r="20"
          stroke="#EF4444"
          strokeWidth="3"
          fill="none"
        />
      )}
      {wrongGuesses >= 2 && (
        <line
          x1="120"
          y1="90"
          x2="120"
          y2="180"
          stroke="#EF4444"
          strokeWidth="3"
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
        />
      )}
      {wrongGuesses >= 5 && (
        <line
          x1="120"
          y1="180"
          x2="80"
          y2="220"
          stroke="#EF4444"
          strokeWidth="3"
        />
      )}
      {wrongGuesses >= 6 && (
        <>
          <line
            x1="120"
            y1="180"
            x2="160"
            y2="220"
            stroke="#EF4444"
            strokeWidth="3"
          />
          <circle cx="110" cy="65" r="2" fill="#EF4444" />
          <circle cx="130" cy="65" r="2" fill="#EF4444" />
          <path
            d="M 110 75 Q 120 85 130 75"
            stroke="#EF4444"
            strokeWidth="2"
            fill="none"
          />
        </>
      )}
    </svg>
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
              setTimeout(() => {
                setShowStartButton(true);
              }, 10000);
            }}
            onError={handleVideoError}
          />

          <div className="absolute inset-0">
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
        </div>
      ) : (
        <div className="text-center text-white p-8">
          <div className="mb-8">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              🎮 Game Đoán Chữ
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Chào mừng bạn đến với trò chơi đoán từ!
            </p>
            <div className="text-gray-400 text-sm mb-8">
              (Không thể tải video intro)
            </div>
          </div>
          <button
            onClick={onStartGame}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 inline-flex items-center gap-2 shadow-lg"
          >
            <Play size={20} />
            Bắt đầu chơi
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
      setScore((prev) => prev + 1);
    } else if (wrongGuesses >= MAX_WRONG_GUESSES) {
      setGameStatus("lost");
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
      return "bg-indigo-500 hover:bg-indigo-600 shadow text-white";
    return SECRET_WORD.split("").some((c) => characterMatches(c, letter))
      ? "bg-green-500 text-white cursor-not-allowed"
      : "bg-red-500 text-white cursor-not-allowed";
  };

  if (!gameStarted) {
    return <IntroVideo onStartGame={startGame} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-indigo-700 drop-shadow">
            🎮 Game Đoán Chữ
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Đoán từ bí mật để chiến thắng!
          </p>
          <div className="mt-2">
            <span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
              🏆 Điểm: {score} | Câu {currentQuestion + 1}/{QUESTIONS.length}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500 mb-2">
                Số lần đoán sai: {wrongGuesses}/{MAX_WRONG_GUESSES}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-red-500 h-3 rounded-full transition-all duration-300"
                  style={{
                    width: `${(wrongGuesses / MAX_WRONG_GUESSES) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <HangmanDrawing wrongGuesses={wrongGuesses} />

            <div className="text-center mb-8">
              <div className="text-5xl font-mono font-bold text-gray-800 tracking-widest mb-3">
                {getDisplayWord()}
              </div>
              <p className="text-sm text-gray-500">
                Từ bí mật có {SECRET_WORD.replace(" ", "").length} chữ cái
              </p>
            </div>

            {gameStatus === "won" && (
              <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded mb-6">
                <p className="font-semibold mb-2">
                  🎉 Chúc mừng! Bạn đã đoán đúng từ:{" "}
                  <strong>{SECRET_WORD}</strong>
                </p>
                <button
                  onClick={randomQuestion}
                  className="mt-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 text-sm"
                >
                  Câu hỏi tiếp theo →
                </button>
              </div>
            )}
            {gameStatus === "lost" && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6">
                <p className="font-semibold mb-2">
                  😞 Rất tiếc! Từ đúng là: <strong>{SECRET_WORD}</strong>
                </p>
                <button
                  onClick={randomQuestion}
                  className="mt-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 text-sm"
                >
                  Thử câu hỏi khác →
                </button>
              </div>
            )}

            {usedHints.length > 0 && gameStatus === "playing" && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-6">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-5 h-5 mt-1" />
                  <div>
                    <p className="font-semibold text-sm mb-1">
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
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Chọn chữ cái
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {VIETNAMESE_ALPHABET.map((letter) => (
                  <button
                    key={letter}
                    onClick={() => guessLetter(letter)}
                    disabled={
                      guessedLetters.includes(letter) ||
                      gameStatus !== "playing"
                    }
                    className={`px-3 py-2 rounded-lg font-bold text-sm transition-all duration-200 transform hover:scale-105 ${getLetterButtonStyle(
                      letter
                    )} ${
                      gameStatus !== "playing"
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Chữ cái đã đoán
              </h3>
              <div className="flex flex-wrap gap-2">
                {guessedLetters.length === 0 ? (
                  <span className="text-gray-400 italic text-sm">
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
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          correct
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
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

        <div className="text-center mt-10 space-x-4">
          <button
            onClick={resetGame}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 inline-flex items-center gap-2 shadow-lg"
          >
            <RotateCcw size={20} /> Chơi lại câu này
          </button>
          <button
            onClick={randomQuestion}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 inline-flex items-center gap-2 shadow-lg"
          >
            🔀 Câu ngẫu nhiên
          </button>
          <button
            onClick={() => setGameStarted(false)}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 inline-flex items-center gap-2 shadow-lg"
          >
            🎬 Xem lại intro
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
