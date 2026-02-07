import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Target, BookOpen, Rocket } from "lucide-react";

const cards = [
  {
    icon: Target,
    title: "Team Goal",
    subtitle: "우리의 목표",
    description:
      "실무에서 바로 통하는 개발자로 성장합니다. 이론만이 아닌, 실제 프로젝트 경험을 통해 포트폴리오를 만들어가요.",
    gradient: "from-blue-400/20 to-cyan-400/20",
  },
  {
    icon: BookOpen,
    title: "Rules",
    subtitle: "활동 규칙",
    description:
      "매주 정기 모임 참석, 팀 프로젝트 필수 참여, 서로 존중하는 커뮤니케이션. 작은 약속이 큰 성장을 만듭니다.",
    gradient: "from-purple-400/20 to-pink-400/20",
  },
  {
    icon: Rocket,
    title: "Roadmap",
    subtitle: "성장 로드맵",
    description:
      "기초 스터디 → 팀 프로젝트 → 공모전 참가 → 멘토링. 단계별로 성장할 수 있는 체계적인 커리큘럼을 제공해요.",
    gradient: "from-orange-400/20 to-yellow-400/20",
  },
];

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 md:py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            About Us
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            소인배는 소수정예로 운영되는 개발 동아리입니다.
            <br />
            함께 성장하고, 함께 도전합니다.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="glass-card p-8 h-full relative overflow-hidden group cursor-pointer"
              >
                {/* Background Gradient on Hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-deep-blue to-deep-purple flex items-center justify-center mb-6 shadow-lg">
                    <card.icon className="w-7 h-7 text-white" />
                  </div>

                  <p className="text-sm font-medium text-deep-purple mb-1">
                    {card.subtitle}
                  </p>
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    {card.title}
                  </h3>
                  <p className="text-foreground/70 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
