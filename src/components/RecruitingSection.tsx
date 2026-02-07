import { useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import {
  HelpCircle,
  Brain,
  Layout,
  Server,
  Shield,
  X,
  CheckCircle,
} from "lucide-react";

const talents = [
  {
    icon: HelpCircle,
    reveal: "🤝 협업 능력",
    description: "함께 일하는 것을 즐기고, 의견을 경청할 줄 아는 사람",
  },
  {
    icon: HelpCircle,
    reveal: "🔥 열정과 끈기",
    description: "어려운 문제도 포기하지 않고 끝까지 해결하려는 의지",
  },
  {
    icon: HelpCircle,
    reveal: "📚 배움의 자세",
    description: "새로운 것을 배우는 것에 거부감이 없고 성장을 추구하는 사람",
  },
];

const tracks = [
  {
    id: "ai",
    icon: Brain,
    name: "AI / ML",
    color: "from-violet-500 to-purple-600",
    description: "인공지능과 머신러닝의 세계",
    curriculum: [
      "Python 기초 및 데이터 분석",
      "머신러닝 알고리즘 이해",
      "딥러닝 프레임워크 (PyTorch/TensorFlow)",
      "LLM 활용 프로젝트",
    ],
    projects: "챗봇 개발, 이미지 분류, 추천 시스템",
  },
  {
    id: "frontend",
    icon: Layout,
    name: "Frontend",
    color: "from-cyan-500 to-blue-600",
    description: "눈에 보이는 아름다움을 만드는",
    curriculum: [
      "HTML/CSS/JavaScript 기초",
      "React 및 모던 프레임워크",
      "UI/UX 디자인 원칙",
      "반응형 웹 & 애니메이션",
    ],
    projects: "포트폴리오 사이트, 대시보드, 인터랙티브 웹앱",
  },
  {
    id: "backend",
    icon: Server,
    name: "Backend",
    color: "from-green-500 to-emerald-600",
    description: "안정적인 시스템의 설계자",
    curriculum: [
      "서버 사이드 프로그래밍",
      "데이터베이스 설계",
      "API 설계 및 개발",
      "클라우드 & DevOps",
    ],
    projects: "REST API 서버, 실시간 채팅, 결제 시스템",
  },
  {
    id: "infosec",
    icon: Shield,
    name: "InfoSec",
    color: "from-red-500 to-orange-600",
    description: "디지털 세상의 수호자",
    curriculum: [
      "네트워크 기초",
      "웹 보안 취약점 분석",
      "시스템 해킹 기초",
      "CTF 대회 참가",
    ],
    projects: "보안 취약점 분석, 모의해킹, 보안 도구 개발",
  },
];

const RecruitingSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredTalent, setHoveredTalent] = useState<number | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);

  const selectedTrackData = tracks.find((t) => t.id === selectedTrack);

  return (
    <section id="recruiting" className="py-24 md:py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Who We Want
          </h2>
          <p className="text-lg text-foreground/60">
            소인배가 찾는 인재상과 트랙을 알아보세요
          </p>
        </motion.div>

        {/* Talent Cards */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-center mb-8 text-foreground">
            💫 인재상
          </h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {talents.map((talent, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredTalent(index)}
                onMouseLeave={() => setHoveredTalent(null)}
                className="glass-card p-8 cursor-pointer group relative overflow-hidden min-h-[200px] flex flex-col items-center justify-center"
              >
                <AnimatePresence mode="wait">
                  {hoveredTalent === index ? (
                    <motion.div
                      key="revealed"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="text-center"
                    >
                      <p className="text-2xl font-bold gradient-text mb-3">
                        {talent.reveal}
                      </p>
                      <p className="text-sm text-foreground/70">
                        {talent.description}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="mystery"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="text-center"
                    >
                      <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <HelpCircle className="w-10 h-10 text-gray-500 animate-pulse" />
                      </div>
                      <p className="text-foreground/50 text-sm">
                        호버해서 확인하기
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tracks Grid */}
        <div>
          <h3 className="text-2xl font-bold text-center mb-8 text-foreground">
            🎯 트랙 선택
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
            {tracks.map((track, index) => (
              <motion.button
                key={track.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedTrack(track.id)}
                className="glass-card p-6 text-center group"
              >
                <div
                  className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${track.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}
                >
                  <track.icon className="w-7 h-7 text-white" />
                </div>
                <h4 className="font-bold text-foreground mb-1">{track.name}</h4>
                <p className="text-xs text-foreground/60">{track.description}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Track Modal */}
        <AnimatePresence>
          {selectedTrack && selectedTrackData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
              onClick={() => setSelectedTrack(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-card p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto relative"
              >
                <button
                  onClick={() => setSelectedTrack(null)}
                  className="absolute top-4 right-4 p-2 hover:bg-foreground/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div
                  className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${selectedTrackData.color} flex items-center justify-center shadow-lg`}
                >
                  <selectedTrackData.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold gradient-text mb-2">
                  {selectedTrackData.name}
                </h3>
                <p className="text-foreground/60 mb-6">
                  {selectedTrackData.description}
                </p>

                <div className="mb-6">
                  <h4 className="font-bold text-foreground mb-3">
                    📚 커리큘럼
                  </h4>
                  <ul className="space-y-2">
                    {selectedTrackData.curriculum.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm text-foreground/80"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-3">
                    🚀 예상 프로젝트
                  </h4>
                  <p className="text-sm text-foreground/70">
                    {selectedTrackData.projects}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default RecruitingSection;
