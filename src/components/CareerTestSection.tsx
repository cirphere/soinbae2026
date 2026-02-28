"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Layout, Server, Shield, RotateCcw, Sparkles } from "lucide-react";

// ------------------- Data & Types -------------------

interface Scores {
  frontend: number;
  backend: number;
  ai: number;
  security: number;
}

const questions = [
  {
    id: 1,
    question: "새로운 앱을 만든다면 무엇을 먼저 고민할까요?",
    options: [
      { text: "예쁘고 사용하기 편한 화면 구성", type: "frontend" },
      { text: "데이터를 어떻게 저장하고 처리할지", type: "backend" },
      { text: "이 서비스가 해킹당하면 어쩌지?", type: "security" },
      { text: "사용자 패턴을 분석해서 추천해주고 싶어", type: "ai" },
    ],
  },
  {
    id: 2,
    question: "가장 설레는 순간은 언제인가요?",
    options: [
      { text: "내가 만든 버튼이 화면에 예쁘게 나올 때", type: "frontend" },
      { text: "AI가 내 예상대로 결과를 맞출 때", type: "ai" },
      { text: "API 요청이 성공적으로 처리될 때", type: "backend" },
      { text: "숨겨진 보안 취약점을 발견했을 때", type: "security" },
    ],
  },
  {
    id: 3,
    question: "어떤 타입의 문제를 푸는 게 재밌나요?",
    options: [
      { text: "퍼즐 맞추듯 레이아웃 정리하기", type: "frontend" },
      { text: "복잡한 로직을 효율적으로 설계하기", type: "backend" },
      { text: "데이터 패턴을 찾고 예측 모델 만들기", type: "ai" },
      { text: "시스템의 허점 찾아내기", type: "security" },
    ],
  },
  {
    id: 4,
    question: "친구에게 보여주고 싶은 나의 작업물은?",
    options: [
      { text: "감각적인 웹사이트나 앱", type: "frontend" },
      { text: "똑똑한 챗봇이나 추천 시스템", type: "ai" },
      { text: "안정적으로 돌아가는 대규모 서비스", type: "backend" },
      { text: "해킹 방어 및 보안 분석 리포트", type: "security" },
    ],
  },
];

const results: Record<string, any> = {
  frontend: {
    icon: Layout,
    name: "Frontend",
    color: "from-cyan-500 to-blue-600",
    emoji: "🎨",
    description: "눈에 보이는 아름다움을 만드는 예술가",
    detail: "사용자가 직접 보고 만지는 화면을 만들어요. HTML, CSS, JavaScript로 시작해서 React 같은 도구로 멋진 웹사이트를 만들 수 있어요.",
  },
  backend: {
    icon: Server,
    name: "Backend",
    color: "from-green-500 to-emerald-600",
    emoji: "⚙️",
    description: "보이지 않는 곳에서 시스템을 설계하는 건축가",
    detail: "서버와 데이터베이스를 다루며 서비스의 두뇌 역할을 해요. Python이나 Java로 API를 만들고 데이터를 안전하게 관리해요.",
  },
  ai: {
    icon: Brain,
    name: "AI / ML",
    color: "from-violet-500 to-purple-600",
    emoji: "🤖",
    description: "데이터 속에서 인사이트를 찾는 탐험가",
    detail: "Python으로 데이터를 분석하고, 머신러닝 모델을 만들어 예측하고 추천하는 시스템을 개발해요. ChatGPT 같은 AI도 이 분야예요!",
  },
  security: {
    icon: Shield,
    name: "InfoSec",
    color: "from-red-500 to-orange-600",
    emoji: "🛡️",
    description: "디지털 세상의 수호자",
    detail: "해커처럼 생각하고, 시스템의 약점을 찾아 보호해요. CTF 대회에 참가하고, 보안 취약점을 분석하는 전문가가 될 수 있어요.",
  },
};

// ------------------- Component -------------------

const CareerTestSection = () => {
  // 상태 관리: 'start' | 'quiz' | 'result'
  const [status, setStatus] = useState<"start" | "quiz" | "result">("start");
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [scores, setScores] = useState<Scores>({ frontend: 0, backend: 0, ai: 0, security: 0 });
  const [finalResultKey, setFinalResultKey] = useState<string | null>(null);

  const startTest = () => {
    setStatus("quiz");
    setCurrentQIndex(0);
    setScores({ frontend: 0, backend: 0, ai: 0, security: 0 });
  };

  const handleAnswer = (type: keyof Scores) => {
    // 1. 점수 업데이트
    const newScores = { ...scores, [type]: scores[type] + 1 };
    setScores(newScores);

    // 2. 다음 질문으로 이동 or 결과 산출
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      calculateResult(newScores);
    }
  };

  const calculateResult = (finalScores: Scores) => {
    // 가장 높은 점수를 가진 키 찾기
    const maxScore = Math.max(...Object.values(finalScores));
    const resultKey = Object.keys(finalScores).find(
      (key) => finalScores[key as keyof Scores] === maxScore
    );
    
    setFinalResultKey(resultKey || "frontend"); // 기본값 frontend
    setStatus("result");
  };

  const resetTest = () => {
    setStatus("start");
    setFinalResultKey(null);
  };

  const resultData = finalResultKey ? results[finalResultKey] : null;

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
          className="glass-card p-8 md:p-12 max-w-2xl mx-auto min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden"
        >
          <AnimatePresence mode="wait">
            
            {/* 1. Start Screen */}
            {status === "start" && (
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
                <p className="text-foreground/60 mb-8 leading-relaxed">
                  4개의 질문에 답하고<br />
                  나에게 딱 맞는 개발 트랙을 찾아보세요!
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startTest}
                  className="px-8 py-4 bg-gradient-to-r from-deep-blue to-deep-purple text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
                >
                  테스트 시작하기
                </motion.button>
              </motion.div>
            )}

            {/* 2. Quiz Screen (4지선다) */}
            {status === "quiz" && (
              <motion.div
                key={`question-${currentQIndex}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="w-full"
              >
                <div className="text-center mb-8">
                  <span className="text-sm font-bold text-deep-purple bg-deep-purple/10 px-3 py-1 rounded-full">
                    Q{currentQIndex + 1} / {questions.length}
                  </span>
                  
                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-gray-200 rounded-full mt-4 overflow-hidden">
                    <motion.div 
                      initial={{ width: `${((currentQIndex) / questions.length) * 100}%` }}
                      animate={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
                      className="h-full bg-gradient-to-r from-deep-blue to-deep-purple"
                    />
                  </div>
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-8 text-center min-h-[64px] flex items-center justify-center">
                  {questions[currentQIndex].question}
                </h3>
                
                <div className="grid grid-cols-1 gap-3">
                  {questions[currentQIndex].options.map((option, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.8)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(option.type as keyof Scores)}
                      className="w-full py-4 px-6 glass-card border border-white/20 hover:border-deep-purple/50 text-left font-medium text-foreground/80 hover:text-deep-purple transition-all rounded-xl"
                    >
                      {option.text}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 3. Result Screen */}
            {status === "result" && resultData && (
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
                <p className="text-lg font-medium text-foreground mb-6">
                  {resultData.description}
                </p>
                <div className="bg-white/50 rounded-2xl p-6 mb-8 backdrop-blur-sm">
                  <p className="text-foreground/70 leading-relaxed">
                    {resultData.detail}
                  </p>
                </div>
                
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
