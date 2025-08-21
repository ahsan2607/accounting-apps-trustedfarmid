"use client"
import { useEffect } from "react";
import { isAuthenticated } from "./api";

export function AuthChecker() {
  useEffect(() => {
    // Define interval check
    const interval = setInterval(() => {
      const ok = isAuthenticated();
      if (!ok) {
        console.log("Session expired. Logging out...");
        // redirect or show login page
        localStorage.removeItem("authenticated");
        window.location.href = "/login"; 
      }
    }, 60 * 1000); // check every 1 minute

    // Clear interval on unmount
    return () => clearInterval(interval);
  }, []);

  return null; // invisible component
}