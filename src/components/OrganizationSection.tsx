import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const leader = {
  name: "김동욱",
  position: "팀장 / AI",
  intro: (
    <>
      <b>모두가 함께 성장하는 팀을 꿈꿉니다</b>
      <br />
      <b>LLM 파이프라인 설계 및 응답 성능 최적화</b>
    </>
  ),
  avatar: "/donggle.png",
};

const members = [
  {
    name: "김영광",
    position: "Backend",
    intro: (
      <>
        <b>안정적인 서버 아키텍처를 설계</b>
        <br />
        <b>프론트엔드와의 협업을 통해 서비스 개발</b>
      </>
    ),
    avatar: "/glory.png",
  },
  {
    name: "장민호",
    position: "Backend, Security",
    intro: (
      <>
        <b>안정적인 서버 아키텍처를 설계</b>
        <br />
        <b>암호 및 보안 프로토콜 설계</b>
      </>
    ),
    avatar: "/mino2.jpeg",
  },
  {
    name: "김도형",
    position: "Infra, Security",
    intro: (
      <>
        <b>안전한 서버를 구축하고</b>
        <br />
        <b>시스템 보안을 책임</b>
      </>
    ),
    avatar: "/circle.jpg",
  },
  {
    name: "이환희",
    position: "Frontend",
    intro: (
      <>
        <b>사용자 친화적인 인터페이스를 개발</b>
        <br />
        <b>팀의 프론트엔드 개발을 담당</b>
      </>
    ),
    avatar: "/환희.jpg",
  },
];

interface MemberCardProps {
  member: {
    name: string;
    position: string;
    intro: string | JSX.Element;
    avatar: string;
  };
  isLeader?: boolean;
  delay?: number;
}

const MemberCard = ({
  member,
  isLeader = false,
  delay = 0,
}: MemberCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -8 }}
      className={`glass-card p-6 text-center group cursor-pointer ${
        isLeader ? "md:w-80" : "w-full md:w-72"
      }`}
    >
      <div className="relative mb-5 mx-auto w-24 h-24 md:w-40 md:h-40">
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
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            <span className="gradient-text">Organization</span>
          </h2>
          <p className="text-lg text-foreground/60">
            <b>열적 가득한 소인배 핵심 멤버들을 소개합니다!</b>
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
