import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <h1 className="logo">Jet Nozzle Flow System</h1>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/analysis">Analysis</a></li>
          <li><a href="/nozzle-design">Nozzle Design</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
