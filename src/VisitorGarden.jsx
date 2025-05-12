import { useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function VisitorGarden() {
  useEffect(() => {
    document.body.classList.add("bg-gradient-to-br", "from-black", "to-gray-900", "min-h-screen", "text-white");
    return () => document.body.className = "";
  }, []);

  return (
    <main className="flex flex-col items-center justify-center p-6 gap-8">
      <motion.h1
        className="text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Welcome to Visitor Garden 🌿
      </motion.h1>

      <motion.p
        className="text-xl max-w-xl text-center text-gray-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
      >
        A digital sanctuary of growth, mystery, and futuristic vibes.
      </motion.p>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <Card className="bg-white/5 backdrop-blur-lg border border-white/10 p-4 rounded-2xl shadow-xl">
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">🌱 Plant a Tree</h2>
            <p className="text-sm text-gray-400">Start your journey with your first plant.</p>
            <Button className="mt-4 bg-green-500 hover:bg-green-600 text-white">Plant</Button>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-lg border border-white/10 p-4 rounded-2xl shadow-xl">
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">📈 Garden Stats</h2>
            <p className="text-sm text-gray-400">Track growth, visitors, and life.</p>
            <Button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white">View</Button>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-lg border border-white/10 p-4 rounded-2xl shadow-xl">
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">🧠 AI Assistant</h2>
            <p className="text-sm text-gray-400">Talk to your digital garden guide.</p>
            <Button className="mt-4 bg-purple-500 hover:bg-purple-600 text-white">Ask</Button>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}