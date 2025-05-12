import { useEffect, useState, useRef } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import "./App.css";
import "./index.css";
import { motion } from "framer-motion";

// Move this inside App or useEffect inside component
// Otherwise it's a side effect at top level, which is invalid
function Card({ children }) {
  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-4 rounded-2xl shadow-xl">
      {children}
    </div>
  );
}

function Button({ children, onClick, className = "" }) {
  return (
    <button 
      onClick={onClick}
      className={`mt-4 px-4 py-2 rounded font-semibold ${className}`}
    >
      {children}
    </button>
  );
}

function VisitorGardenUI({ onAddPlant, plantCount }) {
  return (
    <main className="flex flex-col items-center justify-center p-6 gap-8 text-white">
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
        <Card>
          <h2 className="text-xl font-semibold mb-2">🌱 Plant a Tree</h2>
          <p className="text-sm text-gray-400">Start your journey with your first plant.</p>
          <Button 
            onClick={onAddPlant}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Plant Now
          </Button>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-2">📈 Garden Stats</h2>
          <p className="text-sm text-gray-400">Current plants: {plantCount}</p>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">View Stats</Button>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-2">🧠 AI Assistant</h2>
          <p className="text-sm text-gray-400">Talk to your digital garden guide.</p>
          <Button className="bg-purple-500 hover:bg-purple-600 text-white">Ask Guide</Button>
        </Card>
      </motion.div>
    </main>
  );
}

function Plant({ plant, index }) {
  const [isHovered, setIsHovered] = useState(false);
  const emojis = ['🌱', '🌿', '🌳'];
  const type = plant.type || Math.floor(Math.random() * 3);

  return (
    <motion.div
      className="absolute"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        left: `${plant.x}px`,
        top: `${plant.y}px`,
        fontSize: '24px',
        position: 'absolute',
      }}
    >
      {emojis[type]}
      {isHovered && (
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white/10 text-white px-3 py-2 backdrop-blur-md rounded-lg shadow-lg text-sm border border-white/10">
          <div className="font-semibold">Plant #{index + 1}</div>
          <div className="text-xs text-gray-200">
            {plant.createdAt?.toDate().toLocaleDateString()}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function Minimap({ plants, containerRef }) {
  const minimapRef = useRef(null);
  const scale = 0.1;
  const [viewport, setViewport] = useState({ left: 0, top: 0, width: 0, height: 0 });

  useEffect(() => {
    const updateViewport = () => {
      if (containerRef.current) {
        setViewport({
          left: containerRef.current.scrollLeft * scale,
          top: containerRef.current.scrollTop * scale,
          width: containerRef.current.clientWidth * scale,
          height: containerRef.current.clientHeight * scale
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', updateViewport);
      updateViewport();
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', updateViewport);
      }
    };
  }, [scale]);

  const handleMinimapClick = (e) => {
    if (!containerRef.current || !minimapRef.current) return;
    const minimapRect = minimapRef.current.getBoundingClientRect();
    const x = (e.clientX - minimapRect.left) / scale;
    const y = (e.clientY - minimapRect.top) / scale;

    containerRef.current.scrollTo({
      left: x - containerRef.current.clientWidth / 2,
      top: y - containerRef.current.clientHeight / 2,
      behavior: 'smooth'
    });
  };

  return (
    <div 
    ref={minimapRef}
    className="absolute bottom-4 left-4 w-60 h-40 bg-black/70 backdrop-blur-md rounded-xl border border-white/20 shadow-lg overflow-hidden cursor-pointer z-50"
    onClick={handleMinimapClick}
  >
    <div className="text-xs text-white px-2 py-1 bg-white/10 rounded-t-xl">🗺 Minimap</div>
  
      <div className="relative w-full h-full">
        {plants.map((plant) => (
          <div
            key={plant.id}
            className="absolute w-1 h-1 bg-green-500 rounded-full"
            style={{
              left: `${plant.x * scale}px`,
              top: `${plant.y * scale}px`,
            }}
          />
        ))}
        <div
          className="absolute border border-white/30"
          style={{
            left: `${viewport.left}px`,
            top: `${viewport.top}px`,
            width: `${viewport.width}px`,
            height: `${viewport.height}px`,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          }}
        />
      </div>
    </div>
  );
}

function App() {
  const [plants, setPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);

  // Handle music
  useEffect(() => {
    const audio = new Audio('/washing-machine-heart.mp3');
    audio.loop = true;
    audio.volume = 0.2;

    const playAudio = () => audio.play().catch(() => {});
    window.addEventListener("click", playAudio, { once: true });

    return () => {
      audio.pause();
      window.removeEventListener("click", playAudio);
    };
  }, []);

  const getRandomPosition = () => {
    const padding = 100;
    const maxX = 5000 - padding;
    const maxY = 3000 - padding;
    return {
      x: Math.floor(Math.random() * (maxX - padding)) + padding,
      y: Math.floor(Math.random() * (maxY - padding)) + padding
    };
  };

  const addPlant = async () => {
    try {
      setIsLoading(true);
      const position = getRandomPosition();
      await addDoc(collection(db, "plants"), {
        createdAt: serverTimestamp(),
        x: position.x,
        y: position.y,
        type: Math.floor(Math.random() * 3),
      });
      console.log("🌱 New plant added!");
    } catch (err) {
      console.error("Error adding plant:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const wrapper = document.querySelector(".scroll-wrapper");
    if (wrapper) wrapper.scrollTo(2000, 1000); // center
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "plants"), (snapshot) => {
      const plantData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setPlants(plantData);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white">
      <VisitorGardenUI onAddPlant={addPlant} plantCount={plants.length} />

      <div className="garden-container px-8 pb-8 pt-4 relative">
  <h2 className="text-2xl font-bold text-white mb-4">🌳 Your Garden</h2>

  <Minimap plants={plants} containerRef={containerRef} />

  <div 
    ref={containerRef}
    className="scroll-wrapper overflow-auto border border-white/10 rounded-lg h-[600px] relative"
  >
    <div 
      className="plant-field relative w-[5000px] h-[3000px] bg-gradient-to-br from-green-900/50 to-blue-900/50"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
      }}
    >
      {plants.map((plant, index) => (
        <Plant key={plant.id || index} plant={plant} index={index} />
      ))}
    </div>
  </div>
</div>

    </div>
  );
}

export default App;
