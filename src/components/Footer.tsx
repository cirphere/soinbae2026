import { motion } from "framer-motion";
import { Heart, Instagram, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card p-8 md:p-12 text-center"
        >
          <h3 className="text-2xl md:text-3xl font-bold gradient-text mb-4">
            함께 성장할 준비가 되셨나요?
          </h3>
          <p className="text-foreground/60 mb-8 max-w-lg mx-auto">
            소인배와 함께라면 비전공자도 개발자가 될 수 있어요.
            <br />
            지금 바로 지원해주세요!
          </p>

          <motion.a
            href="mailto:soinbae@example.com"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-8 py-4 bg-gradient-to-r from-deep-blue to-deep-purple text-white font-bold rounded-2xl shadow-lg mb-8"
          >
            지원하기
          </motion.a>

          <div className="flex justify-center gap-4 mb-8">
            <motion.a
              href="#"
              whileHover={{ y: -3 }}
              className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/60 transition-colors"
            >
              <Instagram className="w-5 h-5 text-foreground/70" />
            </motion.a>
            <motion.a
              href="mailto:soinbae@example.com"
              whileHover={{ y: -3 }}
              className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/60 transition-colors"
            >
              <Mail className="w-5 h-5 text-foreground/70" />
            </motion.a>
          </div>

          <div className="border-t border-foreground/10 pt-6">
            <p className="text-sm text-foreground/50 flex items-center justify-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-400 fill-red-400" /> by
              소인배
            </p>
            <p className="text-xs text-foreground/40 mt-2">
              © 2025 소인배. All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
