import React, { useState, useMemo } from 'react';

const materials = [
  { id: 'stainless-steel', name: 'Stainless Steel', icon: '🔩', density: 7.8 },
  { id: 'titanium', name: 'Titanium', icon: '⚡', density: 4.5 },
  { id: 'ceramic', name: 'Ceramic', icon: '🏺', density: 3.9 },
  { id: 'inconel', name: 'Inconel', icon: '🔥', density: 8.4 },
  { id: 'aluminum', name: 'Aluminum', icon: '✨', density: 2.7 },
  { id: 'carbon-fiber', name: 'Carbon Fiber', icon: '🧬', density: 1.6 },
];

const NozzleSVG = ({ diameter, length, angle }) => {
  const svgW = 320;
  const svgH = 240;
  const cx = svgW / 2;
  const cy = svgH / 2;

  const inletW = Math.max(20, Math.min(80, diameter * 4));
  const outletW = Math.max(10, Math.min(60, inletW * (angle / 180)));
  const nozzleLen = Math.max(60, Math.min(200, length * 8));

  const startX = cx - nozzleLen / 2;
  const endX = cx + nozzleLen / 2;

  const path = `
    M ${startX} ${cy - inletW / 2}
    L ${endX} ${cy - outletW / 2}
    L ${endX} ${cy + outletW / 2}
    L ${startX} ${cy + inletW / 2}
    Z
  `;

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${svgW} ${svgH}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="nozzleBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(34, 211, 238, 0.3)" />
          <stop offset="50%" stopColor="rgba(99, 102, 241, 0.4)" />
          <stop offset="100%" stopColor="rgba(168, 85, 247, 0.3)" />
        </linearGradient>
        <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="30%" stopColor="rgba(34, 211, 238, 0.15)" />
          <stop offset="100%" stopColor="rgba(34, 211, 238, 0.05)" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Grid */}
      {Array.from({ length: 9 }, (_, i) => (
        <line key={`gv${i}`} x1={(i + 1) * svgW / 10} y1="0" x2={(i + 1) * svgW / 10} y2={svgH}
          stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
      ))}
      {Array.from({ length: 6 }, (_, i) => (
        <line key={`gh${i}`} x1="0" y1={(i + 1) * svgH / 7} x2={svgW} y2={(i + 1) * svgH / 7}
          stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
      ))}

      {/* Flow field */}
      {[0.3, 0.5, 0.7].map((pos, i) => (
        <line key={`flow${i}`}
          x1={endX + 5} y1={cy - 15 + pos * 30}
          x2={endX + 40 + Math.random() * 20} y2={cy - 15 + pos * 30}
          stroke="rgba(34, 211, 238, 0.2)" strokeWidth="1" strokeDasharray="4 4">
          <animate attributeName="x2" values={`${endX + 40};${endX + 70};${endX + 40}`}
            dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0.1;0.3"
            dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
        </line>
      ))}

      {/* Nozzle body */}
      <path d={path} fill="url(#nozzleBodyGrad)" stroke="rgba(34, 211, 238, 0.5)"
        strokeWidth="1.5" filter="url(#glow)" />

      {/* Inlet marker */}
      <line x1={startX} y1={cy - inletW / 2 - 8} x2={startX} y2={cy + inletW / 2 + 8}
        stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" strokeDasharray="3 3" />
      <text x={startX} y={cy + inletW / 2 + 22} fill="#8892a4" fontSize="9"
        textAnchor="middle" fontFamily="JetBrains Mono">Inlet</text>

      {/* Outlet marker */}
      <line x1={endX} y1={cy - outletW / 2 - 8} x2={endX} y2={cy + outletW / 2 + 8}
        stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" strokeDasharray="3 3" />
      <text x={endX} y={cy + outletW / 2 + 22} fill="#8892a4" fontSize="9"
        textAnchor="middle" fontFamily="JetBrains Mono">Outlet</text>

      {/* Dimension labels */}
      <text x={cx} y={cy - Math.max(inletW, outletW) / 2 - 16} fill="#22d3ee" fontSize="10"
        textAnchor="middle" fontFamily="JetBrains Mono" fontWeight="600">
        ⌀{diameter}mm × {length}mm
      </text>
      <text x={cx} y={cy + Math.max(inletW, outletW) / 2 + 36} fill="#a855f7" fontSize="9"
        textAnchor="middle" fontFamily="JetBrains Mono">
        {angle}° convergence
      </text>
    </svg>
  );
};

const NozzleDesign = () => {
  const [params, setParams] = useState({
    diameter: 5,
    length: 10,
    angle: 90,
    material: 'stainless-steel',
  });
  const [optimized, setOptimized] = useState(false);
  const [optimizing, setOptimizing] = useState(false);

  const handleChange = (name, value) => {
    setParams(prev => ({
      ...prev,
      [name]: isNaN(value) ? value : parseFloat(value),
    }));
    setOptimized(false);
  };

  const selectedMat = materials.find(m => m.id === params.material);

  const results = useMemo(() => {
    const area = Math.PI * Math.pow(params.diameter / 2, 2);
    const velocity = (params.angle / 90) * 340 * (params.diameter / 5);
    const throughput = area * velocity * 0.001;
    const efficiency = Math.min(98, 70 + (params.angle / 180) * 20 + (params.length / params.diameter) * 2);
    const weight = area * params.length * (selectedMat?.density || 7.8) * 0.0001;
    const reynoldsNumber = (velocity * params.diameter * 0.001 * 1.225) / 0.0000181;

    return {
      velocity: velocity.toFixed(1),
      throughput: throughput.toFixed(2),
      efficiency: efficiency.toFixed(1),
      weight: weight.toFixed(2),
      reynoldsNumber: reynoldsNumber.toFixed(0),
      exitArea: area.toFixed(2),
    };
  }, [params, selectedMat]);

  const handleOptimize = () => {
    setOptimizing(true);
    setTimeout(() => {
      setOptimizing(false);
      setOptimized(true);
    }, 1500);
  };

  return (
    <div className="nozzle-page" id="nozzle-design-page">
      <div className="page-header">
        <h1>Nozzle Design & Optimization</h1>
        <p>Configure nozzle parameters and preview the design in real-time</p>
      </div>

      <div className="nozzle-layout">
        {/* Form Section */}
        <div className="nozzle-form-section">
          <div className="nozzle-form">
            <div className="form-section-title">📐 Dimensions</div>
            <div className="form-row">
              <div className="form-group">
                <label>Diameter (mm)</label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="0.5"
                  value={params.diameter}
                  onChange={(e) => handleChange('diameter', e.target.value)}
                  id="input-diameter"
                />
                <div className="range-label">
                  <span>1mm</span>
                  <span className="range-value">{params.diameter} mm</span>
                  <span>20mm</span>
                </div>
              </div>
              <div className="form-group">
                <label>Length (mm)</label>
                <input
                  type="range"
                  min="2"
                  max="50"
                  step="0.5"
                  value={params.length}
                  onChange={(e) => handleChange('length', e.target.value)}
                  id="input-length"
                />
                <div className="range-label">
                  <span>2mm</span>
                  <span className="range-value">{params.length} mm</span>
                  <span>50mm</span>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Convergence Angle (degrees)</label>
              <input
                type="range"
                min="10"
                max="170"
                step="5"
                value={params.angle}
                onChange={(e) => handleChange('angle', e.target.value)}
                id="input-angle"
              />
              <div className="range-label">
                <span>10°</span>
                <span className="range-value">{params.angle}°</span>
                <span>170°</span>
              </div>
            </div>

            <div className="form-section-title" style={{ marginTop: '1.5rem' }}>🧱 Material</div>
            <div className="material-grid">
              {materials.map((mat) => (
                <div
                  key={mat.id}
                  className={`material-card ${params.material === mat.id ? 'selected' : ''}`}
                  onClick={() => handleChange('material', mat.id)}
                  id={`material-${mat.id}`}
                >
                  <div className="material-icon">{mat.icon}</div>
                  <div className="material-name">{mat.name}</div>
                </div>
              ))}
            </div>

            <button
              className="btn-optimize"
              onClick={handleOptimize}
              disabled={optimizing}
              id="btn-optimize"
            >
              {optimizing ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    style={{ animation: 'spin 1s linear infinite' }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Optimizing...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                  Optimize Design
                </>
              )}
            </button>
          </div>
        </div>

        {/* Preview Section */}
        <div className="nozzle-preview-section">
          <div className="nozzle-preview" id="nozzle-preview">
            <h3>Live Preview</h3>
            <div className="nozzle-svg-container">
              <NozzleSVG
                diameter={params.diameter}
                length={params.length}
                angle={params.angle}
              />
            </div>
          </div>

          {/* Results */}
          {optimized && (
            <div className="optimization-results" id="optimization-results">
              <div className="section-title">Optimization Results</div>
              <div className="results-grid">
                <div className="result-item">
                  <div className="result-label">Exit Velocity</div>
                  <div className="result-value">{results.velocity} m/s</div>
                </div>
                <div className="result-item">
                  <div className="result-label">Throughput</div>
                  <div className="result-value">{results.throughput} L/s</div>
                </div>
                <div className="result-item">
                  <div className="result-label">Efficiency</div>
                  <div className="result-value">{results.efficiency}%</div>
                </div>
                <div className="result-item">
                  <div className="result-label">Est. Weight</div>
                  <div className="result-value">{results.weight} kg</div>
                </div>
                <div className="result-item">
                  <div className="result-label">Reynolds Number</div>
                  <div className="result-value">{Number(results.reynoldsNumber).toLocaleString()}</div>
                </div>
                <div className="result-item">
                  <div className="result-label">Exit Area</div>
                  <div className="result-value">{results.exitArea} mm²</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NozzleDesign;
