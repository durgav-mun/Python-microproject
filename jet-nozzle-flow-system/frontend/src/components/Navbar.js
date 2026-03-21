import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar" id="main-navbar">
      <div className="container">
        <NavLink to="/" className="navbar-brand">
          <svg className="navbar-logo" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="nozzleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
            <circle cx="18" cy="18" r="17" stroke="url(#nozzleGrad)" strokeWidth="1.5" fill="none" opacity="0.3" />
            <path d="M8 18 L14 12 L14 15 L28 15 L28 21 L14 21 L14 24 Z" fill="url(#nozzleGrad)" opacity="0.9" />
            <circle cx="24" cy="18" r="2" fill="#22d3ee" opacity="0.6" />
            <line x1="28" y1="14" x2="32" y2="12" stroke="#22d3ee" strokeWidth="1" opacity="0.4" />
            <line x1="28" y1="18" x2="33" y2="18" stroke="#22d3ee" strokeWidth="1" opacity="0.4" />
            <line x1="28" y1="22" x2="32" y2="24" stroke="#22d3ee" strokeWidth="1" opacity="0.4" />
          </svg>
          <div>
            <div className="navbar-title">Jet Nozzle Flow</div>
            <div className="navbar-subtitle">Monitoring System</div>
          </div>
        </NavLink>

        <ul className={`nav-links ${menuOpen ? 'open' : ''}`} id="nav-menu">
          <li>
            <NavLink to="/" end onClick={() => setMenuOpen(false)}
              className={({ isActive }) => isActive ? 'active' : ''}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard" onClick={() => setMenuOpen(false)}
              className={({ isActive }) => isActive ? 'active' : ''}>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/analysis" onClick={() => setMenuOpen(false)}
              className={({ isActive }) => isActive ? 'active' : ''}>
              Analysis
            </NavLink>
          </li>
          <li>
            <NavLink to="/nozzle-design" onClick={() => setMenuOpen(false)}
              className={({ isActive }) => isActive ? 'active' : ''}>
              Nozzle Design
            </NavLink>
          </li>
        </ul>

        <div className="nav-status" id="system-status">
          <span className="status-dot"></span>
          <span>System Online</span>
        </div>

        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
          id="hamburger-btn"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
