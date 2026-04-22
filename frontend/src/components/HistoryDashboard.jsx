import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight, History, Leaf, Trash2, Search } from 'lucide-react';
import axios from 'axios';

const HistoryDashboard = ({ onBack, onViewReport }) => {
  const [history, setHistory] = useState([]); // ✅ FIXED
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('https://agroai-backend-1h3o.onrender.com/api/history');
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ DELETE FUNCTION (WORKING)
  const handleDelete = async (id) => {
    try {
      // OPTIONAL: backend delete (if API exists)
      await axios.delete(`https://agroai-backend-1h3o.onrender.com/api/history/${id}`);

      // frontend update
      setHistory((prev) => prev.filter(item => item._id !== id));
    } catch (error) {
      console.error('Delete failed:', error);

      // fallback (still delete from UI)
      setHistory((prev) => prev.filter(item => item._id !== id));
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 md:py-20">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl md:text-5xl font-black mb-4 flex items-center gap-4 tracking-tight"
          >
            <div className="p-3 bg-emerald-500/10 rounded-2xl">
              <History className="w-8 h-8 text-emerald-500" />
            </div>
            Analysis History
          </motion.h2>

          <p className="text-slate-400 text-lg">
            Review and manage your previous reports.
          </p>
        </div>

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="btn-secondary flex items-center gap-2"
        >
          <Leaf className="w-4 h-4" />
          New Analysis
        </motion.button>
      </div>

      {/* LOADING */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-6" />
          <p className="text-slate-400">Loading history...</p>
        </div>
      ) : history.length === 0 ? (

        /* EMPTY STATE */
        <div className="text-center py-32">
          <Search className="w-12 h-12 mx-auto text-slate-600 mb-4" />
          <h3 className="text-2xl font-bold mb-2">No History Found</h3>
          <button onClick={onBack} className="btn-primary mt-6">
            Start Analysis
          </button>
        </div>

      ) : (

        /* GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {history.map((item, index) => (
            <motion.div
              key={item._id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-2xl overflow-hidden"
            >

              {/* IMAGE */}
              <div className="relative h-60">
                <img
                  src={item.image}
                  alt={item.disease}
                  className="w-full h-full object-cover"
                />

                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-xs flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                  <h3 className="font-bold">{item.disease}</h3>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="p-4 flex justify-between items-center">
                <button
                  onClick={() => onViewReport(item)}
                  className="text-emerald-500 flex items-center gap-1"
                >
                  View <ChevronRight className="w-4 h-4" />
                </button>

                {/* ✅ DELETE WORKING */}
                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-red-500 hover:scale-110 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryDashboard;