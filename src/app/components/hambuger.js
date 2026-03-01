"use client";
import { useState } from "react";
import Link from "next/link";
import './hambuger.css'

export default function Hamburger() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <button
      
        className="hamburger-btn"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span className={`bar ${isOpen ? "bar1-open" : ""}`}></span>
        <span className={`bar ${isOpen ? "bar2-open" : ""}`}></span>
        <span className={`bar ${isOpen ? "bar3-open" : ""}`}></span>
      </button>

      {/* Overlay */}
      {isOpen && <div className="overlay" onClick={closeMenu}></div>}

      {/* Drawer */}
      <nav className={`drawer ${isOpen ? "drawer-open" : ""}`}>
        <div className="drawer-header">
          <h2 className="logo">VaxControl</h2>
          <button className="close-btn" onClick={closeMenu}>✕</button>
        </div>

        <div className="drawer-links">
          <Link href="/admin/dashboard" onClick={closeMenu}>Dashboard</Link>
          <Link href="/admin/points" onClick={closeMenu}>Health Centers</Link>
          <Link href="/admin/vaccine" onClick={closeMenu}>Vaccines</Link>
          <Link href="/admin/inventor" onClick={closeMenu}>Inventory</Link>
          <Link href="/admin/requests" onClick={closeMenu}>Requests</Link>
          <Link href="/admin/reports" onClick={closeMenu}>Reports</Link>
        </div>

        <button className="logout drawer-logout">Logout</button>
      </nav>

 
    </>
  );
}