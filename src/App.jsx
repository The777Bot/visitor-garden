import { useEffect, useState, useRef } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
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

function VisitorGardenUI({ onAddPlant, plantCount, onViewStats, isLoading }) {
  return (
    <main className="flex flex-col items-center justify-center p-6 gap-8 text-white min-h-screen w-full">
      <motion.div
        className="header"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div>
          <h1>Welcome to Visitor Garden 🌿</h1>
          <p>A digital sanctuary of growth, mystery, and futuristic vibes.</p>
        </div>
      </motion.div>

      {isLoading && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-400" />
          <p className="ml-4 text-lg">Loading your garden...</p>
        </div>
      )}

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 w-full max-w-4xl mx-auto px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <Card>
          <h2 className="text-xl font-semibold mb-2 text-center">🌱 Plant a Tree</h2>
          <p className="text-sm text-gray-400 text-center">Start your journey with your first plant.</p>
          <div className="flex justify-center">
            <Button 
              onClick={onAddPlant}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Plant Now
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-2 text-center">📈 Garden Stats</h2>
          <p className="text-sm text-gray-400 text-center">Current plants: {plantCount}</p>
          <div className="flex justify-center">
            <Button 
              onClick={onViewStats}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              View Stats
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-2 text-center">🧠 AI Assistant</h2>
          <p className="text-sm text-gray-400 text-center">Talk to your digital garden guide.</p>
          <div className="flex justify-center">
            <Button className="bg-purple-500 hover:bg-purple-600 text-white">Ask Guide</Button>
          </div>
        </Card>
      </motion.div>
    </main>
  );
}

function Plant({ plant, index }) {
  const [isHovered, setIsHovered] = useState(false);
  const emojis = ['🌱', '🌿', '🌳'];
  //const type = plant.type || Math.floor(Math.random() * 3);
  const type = plant.type ?? 0; // fallback to default if somehow missing

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
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

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

    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left + containerRef.current.scrollLeft;
        const y = e.clientY - rect.top + containerRef.current.scrollTop;
        setCursorPosition({ x, y });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', updateViewport);
      container.addEventListener('mousemove', handleMouseMove);
      updateViewport();
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', updateViewport);
        container.removeEventListener('mousemove', handleMouseMove);
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
        {/* Cursor indicator */}
        <div
          className="absolute w-2 h-2 bg-red-500 rounded-full transform -translate-x-1 -translate-y-1 animate-pulse"
          style={{
            left: `${cursorPosition.x * scale}px`,
            top: `${cursorPosition.y * scale}px`,
          }}
        />
      </div>
    </div>
  );
}


function WeatherOverlay({ mode }) {
  if (mode === "sunny") return null;

  const count = mode === "rainy" || mode === "storm" ? 80 : mode === "snowy" ? 50 : 30;
  const elementClass = mode === "rainy" || mode === "storm" ? "raindrop" : mode === "snowy" ? "snowflake" : "leaf";
  
  
  return (
    <>
      {/* Precipitation or leaves */}
      <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
        {[...Array(count)].map((_, i) => (
          <div
            key={i}
            className={elementClass}
            style={{ "--i": i, "--x": Math.random() }}
          />
        ))}
      </div>

      {/* Lightning flash effect for storm */}
      {mode === "storm" && <div className="lightning-flash" />}

      {/* Moving clouds for storm, breezy or cloudy mode */}
      {["storm", "breezy", "cloudy"].includes(mode) && (
        <div className="pointer-events-none absolute inset-0 z-20">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="cloud" />
          ))}
        </div>
      )}
    </>
  );
}

function StatsModal({ isOpen, onClose, plants }) {
  if (!isOpen) return null;
  
  // ... rest of the StatsModal implementation ...
}

function App() {
  const [plants, setPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);
  const [weatherMode, setWeatherMode] = useState("sunny");
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

  const checkVisitorPlant = async () => {
    const visitorId = localStorage.getItem("visitorId");
    if (!visitorId) return false;
    
    const visitorRef = doc(db, "visitors", visitorId);
    const visitorSnap = await getDoc(visitorRef);
    
    return visitorSnap.exists() && visitorSnap.data().hasPlanted;
  };

  const addPlant = async () => {
    if (isLoading) {
      alert("Loading... Please wait a moment before planting. 🌱");
      return;
    }
    try {
      const hasPlanted = await checkVisitorPlant();
      if (hasPlanted) {
        alert("You have already planted a tree in this garden! 🌳");
        return;
      }
      setIsLoading(true);
      const position = getRandomPosition();
      
      const visitorId = localStorage.getItem("visitorId") || crypto.randomUUID();
      localStorage.setItem("visitorId", visitorId);
    
      await addDoc(collection(db, "plants"), {
        createdAt: serverTimestamp(),
        x: position.x,
        y: position.y,
        type: Math.floor(Math.random() * 3),
        visitorId: visitorId
      });

      const visitorRef = doc(db, "visitors", visitorId);
      await setDoc(visitorRef, {
        hasPlanted: true,
        lastPlanted: serverTimestamp()
      }, { merge: true });

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
   
  useEffect(() => {
    const timeout = setTimeout(() => {
      containerRef.current?.scrollTo(2000, 1000);
    }, 300);
    return () => clearTimeout(timeout);
  }, [plants]);
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white">
      <WeatherOverlay mode={weatherMode} />

      <div className="fixed top-4 right-4 z-50 space-x-2 bg-black/30 px-3 py-2 rounded-xl border border-white/20 text-sm">
  <button onClick={() => setWeatherMode("sunny")} className="hover:underline">☀️ Sunny</button>
  <button onClick={() => setWeatherMode("rainy")} className="hover:underline">🌧️ Rain</button>
  <button onClick={() => setWeatherMode("snowy")} className="hover:underline">❄️ Snow</button>
  <button onClick={() => setWeatherMode("breezy")} className="hover:underline">🍃 Breezy</button>
  <button onClick={() => setWeatherMode("storm")} className="hover:underline">⛈️ Storm</button>
</div>

      <Button
        onClick={() => containerRef.current?.scrollTo(2000, 1000)}
        className="bg-yellow-500 hover:bg-yellow-600 text-white fixed bottom-4 right-4 z-50"
      >
        Center View
      </Button>

      <div className="container mx-auto px-4">
        <VisitorGardenUI onAddPlant={addPlant} plantCount={plants.length} />

        <div className="garden-container pb-8 pt-4 relative flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">🌳 Your Garden</h2>

          <Minimap plants={plants} containerRef={containerRef} />

          <div 
            ref={containerRef}
            className="scroll-wrapper overflow-y-auto overflow-x-hidden border border-white/10 rounded-lg h-[600px] relative pb-[30px] w-full max-w-5xl mx-auto"
          >
            <div 
              className="plant-field relative w-[5000px] h-[3000px] mb-[30px] rounded-[5px]"
              style={{
                backgroundColor: '#5C4033', // soil brown
                backgroundImage: `
                  url('https://www.transparenttextures.com/patterns/crissxcross.png'),
                  linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
                `,
                backgroundSize: 'auto, 50px 50px, 50px 50px',
                backgroundRepeat: 'repeat',
                boxShadow: 'inset 0 0 0 20px #064e3b' // dark green border inside
              }}
            >
              {/* Floating dust particles */}
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="dust"
                  style={{
                    left: `${Math.random() * 5000}px`,
                    top: `${Math.random() * 3000}px`,
                    animationDelay: `${Math.random() * 5}s`,
                  }}
                />
              ))}

              {/* Render plants */}
              {plants.map((plant, index) => (
                <Plant key={plant.id || index} plant={plant} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;