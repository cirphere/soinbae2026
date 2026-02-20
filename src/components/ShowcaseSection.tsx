import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Trophy, Star, Rocket, ChevronLeft, ChevronRight } from "lucide-react";

const achievements = [
  { icon: Trophy, label: "공모전 참가 ", count: 20 },
  { icon: Star, label: "프로젝트 완료", count: 20 },
  { icon: Rocket, label: "배출 개발자", count: 20 },
];

const projects = [
  {
    title: (
      <>
        <b>성균관대학교 주관</b>
        <br />
        <b>사회공헌 아이디어 경진대회</b>
      </>
    ),
    award: "동 상",
    description: "컴퓨터 비전을 활용한 독거노인 낙상 감지 시스템",
    image: "/aib.jpeg",
  },
  {
    title: <b><br/>We-meet 프로젝트 금상 수상</b>,
    award: "금 상",
    description: "AI를 활용한 기업 맞춤형 투자자 추천 서비스 개발",
    image: "/we_meet.jpg",
  },
  {
    title: <b><br/>SW 창업 아이디어 경진대회</b>,
    award: "우수상",
    description: "AI 기반 맞춤형 스마트 약통",
    image: "/SW_H.jpeg",
  },
  {
    title: (
      <>
        <b>AUTO HACK</b>
        <br />
        <b>자동차 해킹방어 대회</b>
      </>
    ),
    award: "예선 통과",
    description: "자동차 해킹방어 기술 습득 및 실습",
    image: "/autohack.jpeg",
  },
  {
    title: (
      <>
        <b>2025 AI EXPO 코엑스</b>
        <br />
      </>
    ),
    award: "AI EXPO 관람",
    description: "최신 AI 기술 및 트렌드 탐색",
    image: "/aiexpo.jpeg",
  },
  {
    title: (
      <>
        <b>2025 CO-WEEK</b>
        <br />
      </>
    ),
    award: "칭평 알펜시아 리조트 워크숍",
    description: "첨단분야 혁신 융합대학 18개 컨소시엄 체험",
    image: "/coweek.jpeg",
  },
  {
    title:(
      <>
        <b>NVIDIA 주관</b>
        <br />
        <b>자연어 처리 기술 교육 수료</b>
      </>
    ),
    award: "NVIDIA 수료증",
    description: "트랜스포머를 활용한 자연어 처리 기술 교육 이수",
    image: "/Nvidia.jpeg",
  },
  {
    title: (
      <>
        <b>호남 정보보안 해커톤</b>
        <br />
      </>
    ),
    award: "예선 통과",
    description: "다양한 정보보안 기술 활용 및 문제풀이",
    image: "/hackjunnam.jpeg",
  },
  {
    title: (
      <>
        <b>클라우드 기반</b>
        <br />
        <b>생성형 AI 서비스 개발 경진대회</b>
      </>
    ),
    award: "최우수상",
    description: "클라우드 기반 생성형 AI 서비스 개발 및 최적화",
    image: "/nhn_cloud.jpg",
  },
  {
    title: (
      <>
        <b>J-curve Next 스타트업 부트캡프</b>
        <br />
      </>
    ),
    award: "대 상",
    description: "창업 아이디어 기반 AI 스타트업 부트캠프",
    image: "/J-curve.jpg",
  },
];

interface CounterProps {
  target: number;
  duration?: number;
}

const Counter = ({ target, duration = 2 }: CounterProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const increment = target / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return (
    <span ref={ref} className="text-5xl md:text-6xl font-black gradient-text">
      {count}+
    </span>
  );
};

const ShowcaseSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    projects.forEach((project) => {
      const img = new Image();
      img.src = project.image;
    });
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % projects.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + projects.length) % projects.length);
  };

  return (
    <section id="showcase" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-aurora opacity-20" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            <span className="gradient-text">Showcase</span>
          </h2>
          <p className="text-lg text-foreground/60 font-black">
            팀원들이 이룬 빛나는 성과를 소개합니다.
          </p>
        </motion.div>

        {/* Counter Stats */}
        <div className="grid grid-cols-3 gap-6 md:gap-12 max-w-3xl mx-auto mb-20">
          {achievements.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-deep-blue to-deep-purple flex items-center justify-center shadow-lg">
                <item.icon className="w-7 h-7 text-white" />
              </div>
              <Counter target={item.count} />
              <p className="text-sm text-foreground/60 mt-2">{item.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Project Carousel */}
        <div className="relative max-w-6xl mx-auto">
          <div className="overflow-hidden rounded-3xl">
            <motion.div
              animate={{ x: `-${currentSlide * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="flex transform-gpu"
              style={{ willChange: "transform" }}
            >
              {projects.map((project, index) => (
                <div key={index} className="min-w-full">
                  <div className="glass-card overflow-hidden">
                    <div className="md:flex">
                      <div className="md:w-2/3">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-64 md:h-96 object-cover"
                        />
                      </div>
                      <div className="p-6 md:p-8 md:w-1/3 flex flex-col justify-center">
                        <span className="inline-block px-3 py-1 bg-gradient-to-r from-deep-blue to-deep-purple text-white text-xs font-bold rounded-full mb-3 w-fit">
                          {project.award}
                        </span>
                        <h3 className="text-2xl font-bold text-foreground mb-2">
                          {project.title}
                        </h3>
                        <p className="text-foreground/60">
                          {project.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/60 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/60 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentSlide === index
                    ? "w-6 bg-deep-blue"
                    : "bg-foreground/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;
