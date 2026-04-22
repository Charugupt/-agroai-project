import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';

// ✅ LOCAL IMAGES
import cornImg from './assets/corn.jpg';
import blightImg from './assets/blight.jpg';
import mildewImg from './assets/mildew.jpg';

// COMPONENTS
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import UploadBox from './components/UploadBox';
import ResultCard from './components/ResultCard';
import HistoryDashboard from './components/HistoryDashboard';

const API_URL = 'http://localhost:3000/api/upload';

function App() {
  const [view, setView] = useState('landing');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async (file) => {
    setIsLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(API_URL, formData);
      setResult(response.data);
      setView('result');
    } catch (err) {
      console.error(err);
      setError('Analysis failed. Backend or ML service might be offline.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewReport = (item) => {
    setResult(item);
    setPreviewImage(item.image);
    setView('result');
  };

  const reset = () => {
    setView('landing');
    setResult(null);
    setPreviewImage(null);
    setError(null);
  };

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  return (
    <div className="min-h-screen gradient-bg selection:bg-emerald-500/30 overflow-x-hidden">
      
      <Navbar
        onHistory={() => setView('history')}
        onHome={reset}
        onNavigate={(page) => setView(page)}
      />

      <main className="relative pt-20 pb-32">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse-slow" />
          <div className="absolute top-3/4 -right-1/4 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full animate-pulse-slow [animation-delay:2s]" />
        </div>

        <AnimatePresence mode="wait">
          {/* HOW IT WORKS */}
          {view === 'how' && (
            <motion.div
              key="how"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="max-w-5xl mx-auto px-6 py-12"
            >
              <h1 className="text-5xl md:text-6xl font-black text-center mb-6 tracking-tight">
                How <span className="text-gradient">AgroAI</span> Works
              </h1>
              <p className="text-slate-400 text-center text-lg mb-16 max-w-2xl mx-auto">
                Our platform combines cutting-edge computer vision with agricultural expertise.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { step: "01", title: "Capture Image", desc: "Take a clear photo of the suspected leaf in natural lighting." },
                  { step: "02", title: "Cloud Processing", desc: "Our neural networks analyze cellular patterns to identify anomalies." },
                  { step: "03", title: "Expert Report", desc: "Receive a detailed diagnosis with verified treatment protocols." }
                ].map((item, i) => (
                  <div key={i} className="glass-card p-10 rounded-[2.5rem] border-white/5 relative group">
                    <div className="text-6xl font-black text-emerald-500/10 absolute top-6 right-8 group-hover:text-emerald-500/20 transition-colors">
                      {item.step}
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* PLANT LIBRARY */}
          {view === 'library' && (
            <motion.div
              key="library"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="max-w-7xl mx-auto px-6 py-12"
            >
              <h1 className="text-5xl md:text-6xl font-black text-center mb-6 tracking-tight">
                Disease <span className="text-gradient">Catalog</span>
              </h1>
              <p className="text-slate-400 text-center text-lg mb-16 max-w-2xl mx-auto">
                Explore common plant diseases detected by our AI system.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { img: cornImg, title: "Corn - Common Rust", desc: "Fungal infection causing reddish-brown pustules on leaves." },
                  { img: blightImg, title: "Leaf Blight", desc: "Water-soaked lesions that rapidly turn brown and necrotic." },
                  { img: mildewImg, title: "Powdery Mildew", desc: "White, flour-like fungal growth on leaf surfaces." }
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ y: -10 }}
                    className="glass-card overflow-hidden rounded-[2.5rem] border-white/5 group"
                  >
                    <div className="h-56 overflow-hidden">
                      <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="p-8">
                      <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* LANDING */}
          {view === 'landing' && (
            <motion.div 
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Hero onStart={() => setView('analysis')} />
            </motion.div>
          )}

          {/* ANALYSIS */}
          {view === 'analysis' && (
            <motion.div 
              key="analysis"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
            >
              <UploadBox onAnalyze={handleAnalyze} isLoading={isLoading} />
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 text-red-400 text-center font-bold bg-red-500/10 p-4 rounded-2xl max-w-md mx-auto border border-red-500/20"
                  >
                    ⚠️ {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* RESULT */}
          {view === 'result' && result && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <ResultCard data={result} image={previewImage} onReset={reset} />
            </motion.div>
          )}

          {/* HISTORY */}
          {view === 'history' && (
            <motion.div 
              key="history"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <HistoryDashboard onBack={reset} onViewReport={handleViewReport} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-20 border-t border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <span className="text-emerald-500 font-bold">A</span>
             </div>
             <span className="text-xl font-black tracking-tighter">AgroAI</span>
          </div>
          <p className="text-slate-500 text-sm">
            © 2026 AgroAI Intelligence Systems. Secure Agricultural Diagnostics.
          </p>
          <div className="flex gap-8 text-slate-400 text-sm font-medium">
            <a href="#" className="hover:text-emerald-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Terms</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;