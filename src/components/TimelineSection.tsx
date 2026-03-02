"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Trophy, BookOpen, Code, Users, Sparkles, Target } from "lucide-react";

const pastItems = [
  { icon: BookOpen, title: "기초 스터디", desc: "Python, JS 기초 완성" },
  { icon: Code, title: "첫 프로젝트", desc: "팀 프로젝트 4개 완료" },
  { icon: Trophy, title: "교내 경진대회 입상", desc: "We-meet 프로젝트 금상" },
];

const nowItems = [
  { icon: Users, title: "신입 멘토링", desc: "신입생 맞춤 교육 진행 예정" },
  { icon: Sparkles, title: "AI 프로젝트", desc: "LLM 활용 서비스 개발" },
  { icon: Target, title: "외부 공모전", desc: "SW/창업 공모전 준비" },
];

const TimelineSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="timeline" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 gradient-aurora opacity-30" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            <span className="gradient-text">Timeline</span>
          </h2>
          <p className="text-lg text-foreground/60 font-extrabold">
            과거의 성과를 바탕으로 더 나은 팀을 만들어 나갑니다
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
          {/* Past */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="glass-card p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-foreground/10 flex items-center justify-center">
                  <span className="text-2xl">📅</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">Past</h3>
                  <p className="text-sm text-foreground/60">2025년 활동</p>
                </div>
              </div>

              <div className="space-y-6">
                {pastItems.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center flex-shrink-0 group-hover:from-deep-blue group-hover:to-deep-purple transition-all duration-300">
                      <item.icon className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {item.title}
                      </h4>
                      <p className="text-sm text-foreground/60">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Now */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="glass-card p-8 border-2 border-deep-blue/30 relative overflow-hidden">
              {/* Highlight Effect */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-deep-blue/20 to-deep-purple/20 blur-3xl" />

              <div className="flex items-center gap-3 mb-8 relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-deep-blue to-deep-purple flex items-center justify-center">
                  <span className="text-2xl">✨</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold gradient-text">Now</h3>
                  <p className="text-sm text-foreground/60">
                    2026년 진행 예정
                  </p>
                </div>
                <span className="ml-auto px-3 py-1 bg-gradient-to-r from-deep-blue to-deep-purple text-white text-xs font-bold rounded-full animate-pulse">
                  LIVE
                </span>
              </div>

              <div className="space-y-6 relative">
                {nowItems.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-deep-blue to-deep-purple flex items-center justify-center flex-shrink-0 shadow-lg">
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {item.title}
                      </h4>
                      <p className="text-sm text-foreground/60">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
