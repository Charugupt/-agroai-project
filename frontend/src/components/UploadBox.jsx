import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Sparkles, AlertCircle, Image as ImageIcon, Loader2 } from 'lucide-react';

const UploadBox = ({ onAnalyze, isLoading }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (file) => {
    if (file && file.type.startsWith('image/')) {
      // ✅ Size check
      if (file.size > 5 * 1024 * 1024) {
        alert("Image too large. Please upload under 5MB.");
        return;
      }

      setSelectedFile(file);
      const imageURL = URL.createObjectURL(file);
      setPreview(imageURL);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  const handleAnalyzeClick = () => {
    if (!selectedFile || isLoading) return;
    onAnalyze(selectedFile);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 md:p-16 rounded-[2.5rem] relative overflow-hidden"
      >
        {/* Background glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full" />

        <div className="relative z-10 text-center">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
          >
            <ImageIcon className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-slate-300">Image Analysis Studio</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            Analyze Your <span className="text-gradient">Crop Health</span>
          </h2>

          {/* ✅ Updated description */}
          <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto">
            Upload a clear image of a plant leaf. This AI model is trained mainly on
            <span className="text-emerald-400 font-semibold"> Tomato, Potato, and Corn </span>
            crops and detects diseases within these categories.
          </p>

          {/* Upload Area */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => !selectedFile && fileInputRef.current.click()}
            className={`relative min-h-[350px] border-2 border-dashed rounded-[2rem] transition-all duration-500 flex flex-col items-center justify-center overflow-hidden group ${isDragging
                ? 'border-emerald-500 bg-emerald-500/5'
                : 'border-white/10 hover:border-emerald-500/50 hover:bg-white/[0.02]'
              } ${selectedFile ? 'cursor-default border-solid border-white/10' : 'cursor-pointer'}`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileChange(e.target.files[0])}
              className="hidden"
              accept="image/*"
            />

            <AnimatePresence mode="wait">
              {!selectedFile ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col items-center p-8"
                >
                  <div className="w-24 h-24 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                    <Upload className="w-10 h-10 text-emerald-500" />
                  </div>

                  {/* ✅ Updated text */}
                  <p className="text-2xl font-bold mb-3">
                    {isDragging ? 'Drop it here!' : 'Select supported leaf image'}
                  </p>

                  <p className="text-slate-500 text-center max-w-xs">
                    Drag & drop or click to browse. Supports JPG, PNG or WEBP
                    (best for Tomato, Potato, Corn).
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative w-full h-full p-4"
                >
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[314px]">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20" />

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove();
                      }}
                      className="absolute top-4 right-4 p-3 bg-black/60 backdrop-blur-xl rounded-2xl hover:bg-red-500/80 transition-all border border-white/10"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>

                    <div className="absolute bottom-4 left-4 px-4 py-2 bg-emerald-500/90 text-white text-xs font-bold rounded-lg shadow-lg">
                      READY FOR ANALYSIS
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Analyze Button */}
          <div className="mt-12 flex flex-col items-center gap-6">
            <button
              disabled={!selectedFile || isLoading}
              onClick={handleAnalyzeClick}
              className="btn-primary w-full max-w-md flex items-center justify-center gap-3 h-16 text-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Analyzing Leaf Image...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  Run AI Diagnostics
                </>
              )}
            </button>

            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 text-emerald-400 font-medium italic"
                >
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                  AI is analyzing plant health...
                </motion.div>
              )}
            </AnimatePresence>

            {/* ✅ Updated warning */}
            <div className="flex items-center gap-2 text-sm text-yellow-400 bg-yellow-500/10 px-4 py-2 rounded-full border border-yellow-500/20">
              <AlertCircle className="w-4 h-4" />
              Model works best for Tomato, Potato & Corn plants only
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UploadBox;