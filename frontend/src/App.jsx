import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';

// IMAGES
import cornImg from './assets/corn.jpg';
import blightImg from './assets/blight.jpg';
import mildewImg from './assets/mildew.jpg';

// COMPONENTS
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import UploadBox from './components/UploadBox';
import ResultCard from './components/ResultCard';
import HistoryDashboard from './components/HistoryDashboard';

// ✅ BACKEND URL
const API_URL = "https://agroai-server-5iuu.onrender.com/predict";

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
      console.log("🚀 Calling API:", API_URL);

      // ✅ FIXED REQUEST (NO HEADERS)
      const response = await axios.post(API_URL, formData, {
        timeout: 60000
      });

      console.log("✅ RESPONSE:", response.data);

      const data = response.data;

      setResult({
        image: URL.createObjectURL(file),
        disease: data.disease || "Unknown",
        confidence: data.confidence || 0,
        diagnosis: data.diagnosis || "No data available",
        treatment: data.treatment || "No treatment info",
        prevention: data.prevention || "No prevention info"
      });

      setView('result');

    } catch (err) {
      console.error("🔥 FULL ERROR:", err);

      if (err.response) {
        setError(`❌ Server Error: ${err.response.status}`);
      } else if (err.request) {
        setError("⚠️ Server is waking up... wait 30 sec & try again");
      } else {
        setError("❌ Something went wrong");
      }

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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  return (
    <div className="min-h-screen gradient-bg overflow-x-hidden">

      <Navbar
        onHistory={() => setView('history')}
        onHome={reset}
        onNavigate={(page) => setView(page)}
      />

      <main className="pt-20 pb-32">

        <AnimatePresence mode="wait">

          {view === 'landing' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Hero onStart={() => setView('analysis')} />
            </motion.div>
          )}

          {view === 'analysis' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <UploadBox onAnalyze={handleAnalyze} isLoading={isLoading} />

              {error && (
                <div className="mt-6 text-red-400 text-center font-bold bg-red-500/10 p-4 rounded-xl max-w-md mx-auto">
                  {error}
                </div>
              )}
            </motion.div>
          )}

          {view === 'result' && result && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ResultCard data={result} image={previewImage} onReset={reset} />
            </motion.div>
          )}

          {view === 'history' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <HistoryDashboard onBack={reset} onViewReport={handleViewReport} />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      <footer className="py-10 text-center text-gray-400">
        © 2026 AgroAI
      </footer>

    </div>
  );
}

export default App;