import { useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function VisitorGarden({ onAddPlant, plantCount, onEnter }) {
  useEffect(() => {
    document.body.classList.add("bg-gradient-to-br", "from-black", "to-gray-900", "min-h-screen", "text-white");
    return () => document.body.className = "";
  }, []);

  const handleAddPlant = async () => {
    await onAddPlant();
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 gap-8 text-align: center">

      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500 mb-4">
          Welcome to Visitor Garden 🌿
        </h1>
        <p className="text-xl max-w-xl mx-auto text-gray-300">
          A digital sanctuary of growth, mystery, and futuristic vibes.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 w-full max-w-4xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl shadow-xl hover:bg-white/10 transition-all text-center"
        >
          <h2 className="text-2xl font-semibold mb-3 text-center">🌱 Plant a Tree</h2>
          <p className="text-gray-400 mb-4 text-center">Start your journey with your first plant.</p>
          <button
            onClick={handleAddPlant}
            className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all text-center"
          >
            Plant Now
          </button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl shadow-xl hover:bg-white/10 transition-all text-center"
        >
          <h2 className="text-2xl font-semibold mb-3 text-center">📈 Garden Stats</h2>
          <p className="text-gray-400 mb-4 text-center">Current plants: {plantCount}</p>
          <button
            onClick={onEnter}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all text-center"
          >
            View Garden
          </button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl shadow-xl hover:bg-white/10 transition-all"
        >
          <h2 className="text-2xl font-semibold mb-3 text-center">🧠 AI Assistant</h2>
          <p className="text-gray-400 mb-4 text-center">Talk to your digital garden guide.</p>
          <button
            className="w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-all text-center"
          >
            Ask Guide
          </button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="mt-8 text-center"
      >
        <p className="text-gray-400 text-sm">
          Click "View Garden" to explore your digital sanctuary
        </p>
      </motion.div>
    </main>
  );
}