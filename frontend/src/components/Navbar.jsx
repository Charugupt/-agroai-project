import React from 'react';
import { Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

function Navbar({ onNavigate, onHome, onHistory }) {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-brand-dark/40 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LOGO */}
        <motion.div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={onHome}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
            <Leaf className="w-6 h-6 text-emerald-500" />
          </div>
          <h1 className="text-white font-black text-2xl tracking-tighter">
            Agro<span className="text-emerald-500">AI</span>
          </h1>
        </motion.div>

        {/* NAV LINKS */}
        <div className="hidden md:flex items-center gap-10">
          {[
            { name: 'Home', action: onHome },
            { name: 'How it works', action: () => onNavigate('how') },
            { name: 'Plant Library', action: () => onNavigate('library') },
            { name: 'History', action: onHistory },
          ].map((item) => (
            <button
              key={item.name}
              onClick={item.action}
              className="text-slate-400 hover:text-white font-medium transition-colors relative group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all group-hover:w-full" />
            </button>
          ))}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;