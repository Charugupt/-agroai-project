import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, BrainCircuit, ArrowRight } from 'lucide-react';

const Hero = ({ onStart }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center text-center mt-12 md:mt-24 text-white px-4"
    >
      {/* BADGE */}
      <motion.div 
        variants={itemVariants}
        className="px-4 py-1.5 mb-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold tracking-wider uppercase"
      >
        ✨ Powered by Advanced Deep Learning
      </motion.div>

      {/* TITLE */}
      <motion.h1 
        variants={itemVariants}
        className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight max-w-4xl"
      >
        Protect Your Harvest with <span className="text-gradient">Precision AI</span>
      </motion.h1>

      {/* SUBTITLE */}
      <motion.p 
        variants={itemVariants}
        className="text-slate-400 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed"
      >
        Identify crop diseases in seconds. Upload a leaf image and get instant diagnosis, 
        treatment protocols, and prevention tips.
      </motion.p>

      {/* BUTTON */}
      <motion.button
        variants={itemVariants}
        onClick={onStart}
        className="btn-primary group flex items-center gap-3"
      >
        Start Analysis
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </motion.button>

      {/* FEATURE CARDS */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-6xl w-full"
      >
        {[
          {
            icon: <Zap className="w-6 h-6 text-yellow-400" />,
            title: "Fast Detection",
            desc: "Get instant results powered by optimized neural networks."
          },
          {
            icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
            title: "Accurate Results",
            desc: "Trained on over 50,000+ real-world crop disease samples."
          },
          {
            icon: <BrainCircuit className="w-6 h-6 text-blue-400" />,
            title: "Smart Insights",
            desc: "Expert treatment advice and long-term prevention strategies."
          }
        ].map((feature, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="glass-card p-8 rounded-3xl text-left border border-white/5 hover:border-emerald-500/30 transition-all group"
          >
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              {feature.icon}
            </div>
            <h3 className="font-bold text-xl mb-3">{feature.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              {feature.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>

    </motion.div>
  );
};

export default Hero;