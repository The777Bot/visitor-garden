import { db } from "./firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export async function getOrCreateVisitorId() {
  let id = localStorage.getItem("visitorId");
  if (!id) {
    id = crypto.randomUUID(); // Or use fingerprintjs if needed
    localStorage.setItem("visitorId", id);
  }
  return id;
}

export async function handleNewVisitor(onAddPlant) {
    const visitorId = await getOrCreateVisitorId();
    const visitorRef = doc(db, "visitors", visitorId);
    const visitorSnap = await getDoc(visitorRef);
  
    if (!visitorSnap.exists()) {
      // Add to Firestore and trigger plant
      await setDoc(visitorRef, {
        createdAt: serverTimestamp(),
      });
  
      // Then trigger the plant after Firestore operation is complete
      await onAddPlant();
    } else {
      console.log("Visitor already recorded. No new plant added.");
    }
  }
  

export async function trackVisitor(onNewVisitor) {
    try {
      let visitorId = localStorage.getItem("visitorId");
  
      if (!visitorId) {
        visitorId = crypto.randomUUID?.() || Math.random().toString(36).substring(2);
        localStorage.setItem("visitorId", visitorId);
      }
  
      const docRef = doc(db, "visitors", visitorId);
      const docSnap = await getDoc(docRef);
  
      if (!docSnap.exists()) {
        const ip = await fetch("https://api.ipify.org?format=json")
          .then((res) => res.json())
          .then((data) => data.ip)
          .catch(() => "unknown");
  
        await setDoc(docRef, {
          timestamp: Date.now(),
          ip,
        });
  
        console.log("🆕 New visitor added");
  
        if (onNewVisitor) onNewVisitor(); // ✅ Trigger plant only for NEW
      } else {
        console.log("👤 Returning visitor");
      }
    } catch (err) {
      console.error("Tracking visitor failed:", err);
    }
  }