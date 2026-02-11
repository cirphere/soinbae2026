import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Target, BookOpen, Rocket } from "lucide-react";

const cards = [
  {
    icon: Target,
    title: (<b>Team Goal</b>),
    subtitle: (<b>팀 목표</b>),
    description:(
      <>
        <br />
        <b>1학년이 개발하는 과정을 즐겁게 배울 수 있도록 돕고,</b>
        <br />
        <b>수업에서 다루는 이론만이 아닌, 실제 프로젝트를 경험하며 실무에 필요한 능력을 갖춘 인재로 함께 성장하기!</b>
      </>
    ),
    gradient: "from-blue-400/20 to-cyan-400/20",
  },
  {
    icon: BookOpen,
    title: (<b>Rules</b>),
    subtitle: (<b>활동규칙</b>),
    description:(
      <>
        <br />
        <b>1, 서로 존중하고 배려하는 분위기 조성하기</b>
        <br />
        <b>2, 적극적으로 참여하고 소통하기</b>
        <br />
        <b>3, 모르는 것에 대해 두려워하지 말고 물어보기 !!!</b>
      </>
    ),
    gradient: "from-purple-400/20 to-pink-400/20",
  },
  {
    icon: Rocket,
    title: (<b>Roadmap</b>),
    subtitle: (<b>성장 로드맵</b>),
    description:(
      <>
        <b>1학기: 기초스터디 및 팀원들과 친해지기🎉여름방학: We-meet 미니 프로젝트💻</b>
        <br/>
        <b>2학기: 팀 프로젝트 구상/개발👨‍💻</b>
        <br/>
        <b>겨울방학: We-meet 프로젝트 완성👏</b>
        <br/>
        <b>* 꾸준히 팀원들 및 동기들과 해커톤 및 경진대회 활동 *</b>
        <br/>
      </>
    ),
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
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            <span className="gradient-text">About Us</span>
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            소인배는 단순히 개발만 하는게 아닌,
            <br />
            함께 성장하고, 함께 도전하는 팀입니다.
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
