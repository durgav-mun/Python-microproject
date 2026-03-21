import React from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import './styles/main.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Dashboard />
    </div>
  );
}

export default App;
