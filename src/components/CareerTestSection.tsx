import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Layout, Server, Shield, RotateCcw, Sparkles } from "lucide-react";

interface Question {
  id: number;
  question: string;
  yes: number | string;
  no: number | string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "눈에 보이는 결과물을 만드는 게 더 좋아요?",
    yes: 2,
    no: 3,
  },
  {
    id: 2,
    question: "디자인과 사용자 경험에 관심이 많아요?",
    yes: "frontend",
    no: "backend",
  },
  {
    id: 3,
    question: "데이터와 패턴을 분석하는 게 재미있어요?",
    yes: "ai",
    no: "infosec",
  },
];

interface Result {
  id: string;
  icon: typeof Brain;
  name: string;
  color: string;
  emoji: string;
  description: string;
  detail: string;
}

const results: Record<string, Result> = {
  ai: {
    id: "ai",
    icon: Brain,
    name: "AI / ML",
    color: "from-violet-500 to-purple-600",
    emoji: "🤖",
    description: "미래를 예측하는 데이터 마법사",
    detail:
      "숫자와 패턴 속에서 인사이트를 발견하는 당신! 머신러닝과 인공지능으로 세상을 더 스마트하게 만들어보세요. 비전공자도 Python부터 차근차근 배울 수 있어요.",
  },
  frontend: {
    id: "frontend",
    icon: Layout,
    name: "Frontend",
    color: "from-cyan-500 to-blue-600",
    emoji: "🎨",
    description: "눈에 보이는 아름다움을 만드는 예술가",
    detail:
      "디자인 감각과 코딩을 결합해 사용자가 직접 보고 만지는 화면을 만들어요. 웹사이트, 앱의 얼굴을 책임지는 분야! React, CSS로 예쁜 걸 만들고 싶다면 여기예요.",
  },
  backend: {
    id: "backend",
    icon: Server,
    name: "Backend",
    color: "from-green-500 to-emerald-600",
    emoji: "⚙️",
    description: "보이지 않는 곳에서 시스템을 설계하는 건축가",
    detail:
      "서버, 데이터베이스, API 등 서비스의 뒷단을 담당해요. 논리적 사고를 좋아하고, 안정적인 시스템을 만들고 싶다면 백엔드가 딱이에요!",
  },
  infosec: {
    id: "infosec",
    icon: Shield,
    name: "InfoSec",
    color: "from-red-500 to-orange-600",
    emoji: "🛡️",
    description: "디지털 세상의 수호자",
    detail:
      "해킹을 막고, 보안 취약점을 찾아내는 화이트해커의 길! 시스템의 약점을 파악하고 더 안전하게 만드는 데 관심이 있다면 정보보안을 추천해요.",
  },
};

const CareerTestSection = () => {
  const [currentQuestion, setCurrentQuestion] = useState<number | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const startTest = () => {
    setCurrentQuestion(1);
    setResult(null);
  };

  const resetTest = () => {
    setCurrentQuestion(null);
    setResult(null);
  };

  const handleAnswer = (answer: "yes" | "no") => {
    const question = questions.find((q) => q.id === currentQuestion);
    if (!question) return;

    const next = answer === "yes" ? question.yes : question.no;

    if (typeof next === "string") {
      setResult(next);
      setCurrentQuestion(null);
    } else {
      setCurrentQuestion(next);
    }
  };

  const resultData = result ? results[result] : null;

  return (
    <section id="career-test" className="py-24 md:py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            나에게 맞는 개발 분야는?
          </h2>
          <p className="text-lg text-foreground/60">
            간단한 테스트로 알아보세요!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card p-8 md:p-12 max-w-2xl mx-auto min-h-[400px] flex flex-col items-center justify-center"
        >
          <AnimatePresence mode="wait">
            {/* Start Screen */}
            {currentQuestion === null && result === null && (
              <motion.div
                key="start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-deep-blue to-deep-purple flex items-center justify-center shadow-lg">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  개발 분야 추천 테스트
                </h3>
                <p className="text-foreground/60 mb-8">
                  3개의 질문에 답하고
                  <br />
                  나에게 맞는 분야를 찾아보세요!
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startTest}
                  className="px-8 py-4 bg-gradient-to-r from-deep-blue to-deep-purple text-white font-bold rounded-2xl shadow-lg"
                >
                  테스트 시작하기
                </motion.button>
              </motion.div>
            )}

            {/* Questions */}
            {currentQuestion !== null && (
              <motion.div
                key={`question-${currentQuestion}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="text-center w-full"
              >
                <div className="mb-8">
                  <span className="text-sm font-medium text-deep-purple">
                    Q{currentQuestion} / 3
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-10">
                  {questions.find((q) => q.id === currentQuestion)?.question}
                </h3>
                <div className="flex gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAnswer("yes")}
                    className="flex-1 max-w-[140px] py-4 glass-card font-bold text-deep-blue hover:bg-pastel-blue transition-colors"
                  >
                    YES 👍
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAnswer("no")}
                    className="flex-1 max-w-[140px] py-4 glass-card font-bold text-deep-purple hover:bg-pastel-purple transition-colors"
                  >
                    NO 👎
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Result */}
            {result !== null && resultData && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center"
              >
                <div
                  className={`w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br ${resultData.color} flex items-center justify-center shadow-lg`}
                >
                  <resultData.icon className="w-12 h-12 text-white" />
                </div>
                <p className="text-4xl mb-2">{resultData.emoji}</p>
                <h3 className="text-3xl font-bold gradient-text mb-2">
                  {resultData.name}
                </h3>
                <p className="text-lg font-medium text-foreground mb-4">
                  {resultData.description}
                </p>
                <p className="text-foreground/60 mb-8 max-w-md mx-auto leading-relaxed">
                  {resultData.detail}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetTest}
                  className="px-6 py-3 glass-card font-semibold text-foreground hover:bg-white/70 transition-colors inline-flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  다시 하기
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default CareerTestSection;
