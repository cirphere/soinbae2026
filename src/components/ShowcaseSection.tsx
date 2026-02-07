import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Trophy, Star, Rocket, ChevronLeft, ChevronRight } from "lucide-react";

const achievements = [
  { icon: Trophy, label: "공모전 수상", count: 12 },
  { icon: Star, label: "프로젝트 완료", count: 28 },
  { icon: Rocket, label: "배출 개발자", count: 45 },
];

const projects = [
  {
    title: "AI 챗봇 서비스",
    award: "교내 해커톤 대상",
    description: "GPT 기반 학교 생활 도우미 챗봇",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
  },
  {
    title: "캠퍼스 매칭 앱",
    award: "SW 창업대회 우수상",
    description: "관심사 기반 스터디 매칭 플랫폼",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop",
  },
  {
    title: "보안 취약점 분석 도구",
    award: "정보보안 경진대회 입상",
    description: "웹 애플리케이션 취약점 자동 스캔 도구",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop",
  },
  {
    title: "실시간 협업 에디터",
    award: "오픈소스 컨트리뷰션",
    description: "마크다운 기반 실시간 문서 협업 도구",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop",
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
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Hall of Fame
          </h2>
          <p className="text-lg text-foreground/60">
            소인배의 자랑스러운 성과들
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
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden rounded-3xl">
            <motion.div
              animate={{ x: `-${currentSlide * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="flex"
            >
              {projects.map((project, index) => (
                <div key={index} className="min-w-full">
                  <div className="glass-card overflow-hidden">
                    <div className="md:flex">
                      <div className="md:w-1/2">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-48 md:h-64 object-cover"
                        />
                      </div>
                      <div className="p-6 md:p-8 md:w-1/2 flex flex-col justify-center">
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
