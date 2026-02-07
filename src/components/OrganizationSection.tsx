import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const leader = {
  name: "김소인",
  position: "팀장 / Full-Stack",
  intro: "함께 성장하는 개발 문화를 만들어갑니다",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
};

const members = [
  {
    name: "이프론",
    position: "Frontend Lead",
    intro: "사용자 경험을 최우선으로 생각해요",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "박백엔",
    position: "Backend Lead",
    intro: "안정적인 서버 아키텍처를 설계합니다",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "최에이아이",
    position: "AI/ML Lead",
    intro: "데이터로 새로운 가치를 발견해요",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
  },
];

interface MemberCardProps {
  member: {
    name: string;
    position: string;
    intro: string;
    avatar: string;
  };
  isLeader?: boolean;
  delay?: number;
}

const MemberCard = ({ member, isLeader = false, delay = 0 }: MemberCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -8 }}
      className={`glass-card p-6 text-center group cursor-pointer ${
        isLeader ? "md:w-72" : "w-full md:w-64"
      }`}
    >
      <div className="relative mb-5 mx-auto w-24 h-24 md:w-28 md:h-28">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-deep-blue to-deep-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
        <img
          src={member.avatar}
          alt={member.name}
          className="relative w-full h-full object-cover rounded-2xl shadow-lg"
        />
        {isLeader && (
          <div className="absolute -top-2 -right-2 bg-gradient-to-br from-deep-blue to-deep-purple text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
            LEADER
          </div>
        )}
      </div>

      <h3 className="text-xl font-bold text-foreground mb-1">{member.name}</h3>
      <p className="text-sm font-medium text-deep-purple mb-3">
        {member.position}
      </p>
      <p className="text-sm text-foreground/60 leading-relaxed">
        {member.intro}
      </p>
    </motion.div>
  );
};

const OrganizationSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="organization" className="py-24 md:py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Our Team
          </h2>
          <p className="text-lg text-foreground/60">
            소인배를 이끌어가는 핵심 멤버들을 소개합니다
          </p>
        </motion.div>

        {/* Pyramid Layout */}
        <div className="flex flex-col items-center gap-8">
          {/* Leader Row */}
          <MemberCard member={leader} isLeader delay={0.1} />

          {/* Members Row */}
          <div className="flex flex-col md:flex-row gap-6 justify-center w-full">
            {members.map((member, index) => (
              <MemberCard
                key={member.name}
                member={member}
                delay={0.2 + index * 0.1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrganizationSection;
