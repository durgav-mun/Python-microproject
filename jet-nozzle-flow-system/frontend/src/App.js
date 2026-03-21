import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Home from './pages/Home';
import Analysis from './pages/Analysis';
import NozzleDesign from './pages/NozzleDesign';
import './styles/main.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/nozzle-design" element={<NozzleDesign />} />
        </Routes>
        <footer className="app-footer">
          <p>© 2026 Jet Nozzle Flow System — Real-Time Flow Monitoring & Analysis</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
