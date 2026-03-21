import React, { useState } from 'react';

const NozzleDesign = () => {
  const [nozzleParams, setNozzleParams] = useState({
    diameter: 5,
    length: 10,
    angle: 90,
    material: 'stainless-steel',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNozzleParams({
      ...nozzleParams,
      [name]: isNaN(value) ? value : parseFloat(value),
    });
  };

  const handleOptimize = () => {
    console.log('Optimizing nozzle with parameters:', nozzleParams);
    // Send to backend for optimization
  };

  return (
    <div className="nozzle-design">
      <h1>Nozzle Design & Optimization</h1>
      <form className="design-form">
        <fieldset>
          <legend>Nozzle Parameters</legend>
          <div className="form-group">
            <label>Diameter (mm):</label>
            <input
              type="number"
              name="diameter"
              value={nozzleParams.diameter}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Length (mm):</label>
            <input
              type="number"
              name="length"
              value={nozzleParams.length}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Angle (degrees):</label>
            <input
              type="number"
              name="angle"
              value={nozzleParams.angle}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Material:</label>
            <select
              name="material"
              value={nozzleParams.material}
              onChange={handleInputChange}
            >
              <option value="stainless-steel">Stainless Steel</option>
              <option value="titanium">Titanium</option>
              <option value="ceramic">Ceramic</option>
            </select>
          </div>
        </fieldset>
        <button type="button" onClick={handleOptimize} className="btn-optimize">
          Optimize Design
        </button>
      </form>
    </div>
  );
};

export default NozzleDesign;
