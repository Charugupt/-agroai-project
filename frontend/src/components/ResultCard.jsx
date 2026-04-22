import React from 'react';
import { motion } from 'framer-motion';
import {
  Dna,
  Stethoscope,
  ShieldAlert,
  RefreshCw,
  Target,
  ArrowLeft,
  CheckCircle2,
  Info
} from 'lucide-react';

const ResultCard = ({ data, image, onReset }) => {
  const { disease, confidence, diagnosis, treatment, prevention } = data;

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="glass-card flex flex-col lg:flex-row overflow-hidden rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.4)]"
      >
        {/* Left: Image & Confidence */}
        <div className="w-full lg:w-2/5 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-white/5 bg-white/[0.01]">
          <div className="relative mb-10 aspect-square rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 group">
            <img src={image} alt="Analyzed leaf" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute top-6 left-6 px-4 py-2 glass-panel rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              Neural Scan Verified
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <div className="flex justify-between items-end mb-4">
                <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Confidence Level</span>
                <span className="text-3xl font-black text-emerald-400">
                  {confidence.toFixed(1)}%
                </span>
              </div>
              <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden p-1 border border-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(confidence, 100)}%` }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full relative"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] animate-[shimmer_2s_infinite]" />
                </motion.div>
              </div>
            </div>

            <div className="p-6 bg-white/[0.03] rounded-3xl border border-white/5 flex items-center gap-5">
              <div className="p-4 bg-blue-500/10 rounded-2xl">
                <Target className="w-7 h-7 text-blue-400" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">AI Classification</p>
                <p className="text-xl font-bold text-white leading-tight">{disease}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-emerald-400/80 text-xs font-semibold px-2">
              <CheckCircle2 className="w-4 h-4" />
              Analysis completed using ResNet-50 Architecture
            </div>
          </div>
        </div>

        {/* Right: Details */}
        <div className="w-full lg:w-3/5 p-8 md:p-14 space-y-12 overflow-y-auto max-h-[850px] custom-scrollbar">
          <div className="flex justify-between items-start gap-6">
            <div>
              <motion.h3 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-black mb-4 leading-tight tracking-tight text-gradient"
              >
                {disease}
              </motion.h3>
              <div className="flex items-center gap-2 text-emerald-500 font-bold bg-emerald-500/10 w-fit px-4 py-1.5 rounded-full text-sm">
                <Info className="w-4 h-4" />
                Medical Diagnosis Confirmed
              </div>
            </div>
            <motion.button
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.6 }}
              onClick={onReset}
              className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors border border-white/10"
            >
              <RefreshCw className="w-6 h-6 text-slate-300" />
            </motion.button>
          </div>

          <div className="grid gap-10">
            <motion.section variants={sectionVariants} className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <Dna className="w-5 h-5 text-blue-400" />
                </div>
                <h4 className="text-xl font-bold">Scientific Diagnosis</h4>
              </div>
              <p className="text-slate-400 leading-relaxed text-lg bg-white/[0.02] p-7 rounded-[2rem] border border-white/5">
                {diagnosis}
              </p>
            </motion.section>

            <motion.section variants={sectionVariants} className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-emerald-400" />
                </div>
                <h4 className="text-xl font-bold">Treatment Protocol</h4>
              </div>
              <p className="text-slate-400 leading-relaxed text-lg bg-white/[0.02] p-7 rounded-[2rem] border border-white/5">
                {treatment}
              </p>
            </motion.section>

            <motion.section variants={sectionVariants} className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5 text-orange-400" />
                </div>
                <h4 className="text-xl font-bold">Prevention Strategy</h4>
              </div>
              <p className="text-slate-400 leading-relaxed text-lg bg-white/[0.02] p-7 rounded-[2rem] border border-white/5">
                {prevention}
              </p>
            </motion.section> sectionVariants
          </div>

          <button
            onClick={onReset}
            className="flex items-center gap-3 text-slate-400 hover:text-white transition-all text-sm font-bold group mt-10"
          >
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:-translate-x-1 transition-transform">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Analyze another leaf specimen
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ResultCard;
