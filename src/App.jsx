import { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import "./App.css";

function App() {
  const [plants, setPlants] = useState([]);

  // Add a plant when this user visits
  useEffect(() => {
    const addPlant = async () => {
      try {
        await addDoc(collection(db, "plants"), {
          createdAt: serverTimestamp(),
         x: Math.floor(Math.random() * 5000),
         y: Math.floor(Math.random() * 3000), // leave room for heading
        });
        console.log("🌱 New plant added!");
      } catch (err) {
        console.error("Error adding plant:", err);
      }
    };

    addPlant();
  }, []);

  useEffect(() => {
  window.scrollTo(2000, 1000); // Start centered in the garden
}, []);
  // Listen for live updates from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "plants"), (snapshot) => {
      const plantData = snapshot.docs.map((doc) => doc.data());
      setPlants(plantData);
    });

    return () => unsubscribe();
  }, []);

  return (
  <div className="garden-container">
    <div className="header">
      <h1>🌸 Visitor Garden</h1>
      <p>Total plants: {plants.length}</p>
    </div>

    <div className="scroll-wrapper">
      <div className="plant-field">
        {plants.map((plant, index) => (
          <div
            key={index}
            className="plant"
            style={{
              left: plant.x,
              top: plant.y,
            }}
            title={`Plant #${index + 1}`}
          />
        ))}
      </div>
    </div>
  </div>
);
}


export default App;
