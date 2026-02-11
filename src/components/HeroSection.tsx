import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const HeroSection = () => {
  const scrollToAbout = () => {
    const element = document.getElementById("about");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 gradient-aurora animate-aurora opacity-60" />
      
      {/* Floating Orbs */}
      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-pastel-blue/40 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -20, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pastel-purple/40 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, 15, 0],
          y: [0, 15, 0],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 right-1/3 w-48 h-48 bg-pastel-pink/30 rounded-full blur-3xl"
      />

      {/* Main content */}
      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.p 
            className="text-lg md:text-2xl text-muted-foreground mb-4 italic font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <b>AIM? AIM!</b>
          </motion.p>
          
          <motion.h1 
            className="text-7xl md:text-9xl font-black gradient-text mb-6 tracking-tight italic drop-shadow-xl"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8, type: "spring", stiffness: 100 }}
          >
            SOINBAE
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-foreground/80 font-light max-w-2xl mx-auto mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <span className="font-extrabold text-primary">소</span>프트웨어 & AI
            <span className="font-extrabold text-accent"> 인</span>재 
            <span className="font-extrabold text-violet-400">배</span>양
          </motion.p>
          
          <motion.p 
            className="text-muted-foreground max-w-lg mx-auto font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            함께 성장하고, 함께 만들어가는 우리들의 개발 여정
          </motion.p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
      >
       <motion.button
        onClick={scrollToAbout}
        className="group flex flex-col items-center gap-2 text-foreground/70 hover:text-foreground transition-colors cursor-pointer"
        whileHover={{ y: 5 }}
      >
        <span className="text-sm font-medium">더 알아보기</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.button>
    </motion.div>
  </section>
  );
};

export default HeroSection;
