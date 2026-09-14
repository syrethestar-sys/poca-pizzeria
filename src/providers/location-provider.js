"use client";

import { createContext, useContext, useEffect, useState } from "react";

const LocationContext = createContext(null);

// Where the customer wants delivery. Held here so the header picker and the
// checkout form stay in step, and kept in localStorage so it survives a reload.
export function LocationProvider({ children }) {
  const [location, setLocationState] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("location");
      if (saved) setLocationState(JSON.parse(saved));
    } catch (err) {
      console.error(err);
    }
    setReady(true);
  }, []);

  const setLocation = (next) => {
    setLocationState(next);
    try {
      if (next) localStorage.setItem("location", JSON.stringify(next));
      else localStorage.removeItem("location");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <LocationContext.Provider value={{ location, setLocation, ready }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  return useContext(LocationContext);
}
