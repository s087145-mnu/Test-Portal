// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, update } from "firebase/database";

// YOUR FIREBASE CONFIG (With the databaseURL added!)
const firebaseConfig = {
  apiKey: "AIzaSyDDf--VS3O4KtX2Sft_a6ucQIsfVSurDP4",
  authDomain: "spatial-portal-fd9a2.firebaseapp.com",
  databaseURL: "https://spatial-portal-fd9a2-default-rtdb.firebaseio.com",
  projectId: "spatial-portal-fd9a2",
  storageBucket: "spatial-portal-fd9a2.firebasestorage.app",
  messagingSenderId: "608261088324",
  appId: "1:608261088324:web:bc1d16cd696b7be5420811"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const DEFAULT_STATE = {
  activeSkybox: 'https://raw.githubusercontent.com/aframevr/aframe/master/examples/boilerplate/panorama/puydesancy.jpg',
  isLocked: false,
  hotspots: [],
  questions: []
};

export function useMockSync(role) {
  const [portalState, setPortalState] = useState(DEFAULT_STATE);
  
  // This tells Firebase exactly where to save our data
  const stateRef = ref(db, 'portalState');

  useEffect(() => {
    // Listen for changes from ANYWHERE in the world
    const unsubscribe = onValue(stateRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setPortalState({
          ...DEFAULT_STATE,
          ...data,
          hotspots: data.hotspots || [],
          questions: data.questions || []
        });
      } else if (role === 'admin') {
        // If the database is completely empty, the Admin will build the first save file
        set(stateRef, DEFAULT_STATE);
      }
    });

    return () => unsubscribe();
  }, [role]);

  const updatePortalState = useCallback((updates) => {
    // Instantly update our local screen
    setPortalState(prev => ({ ...prev, ...updates }));
    
    // Blast the update up to the Google Firebase Cell Tower!
    update(stateRef, updates);
  }, []);

  return { portalState, updatePortalState };
}