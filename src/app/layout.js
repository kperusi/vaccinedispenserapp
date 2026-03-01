"use client";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import { userContext } from "./context/userContext";
import { useEffect, useState } from "react";

export default function RootLayout({ children }) {
  const [user, setUser] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("user"));
    console.log('///',saved)
    async function loadUser(saved) {
      if (saved) {
        setUser(saved);
      }
     
    }
 loadUser(saved);

  }, []);

  return (
    <html lang="en">
      <userContext.Provider
        value={{
          user: user,
          setUser: setUser,
        }}
      >
        <body>{children}</body>
      </userContext.Provider>
    </html>
  );
}
