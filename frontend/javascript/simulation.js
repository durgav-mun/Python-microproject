let velocityChartInstance = null;
let pressureChartInstance = null;
let animationFrameId = null;
let activeParticles = [];

// Input Editor Pipeline
function submitSimulation() {
    const inletVelocity = parseFloat(document.getElementById('inlet-velocity').value);
    const pressure = parseFloat(document.getElementById('pressure').value);
    const inletRadius = parseFloat(document.getElementById('inlet-radius').value);
    const outletRadius = parseFloat(document.getElementById('outlet-radius').value);
    const fluidDensity = parseFloat(document.getElementById('fluid-density').value);

    if (isNaN(inletVelocity) || isNaN(pressure) || isNaN(inletRadius) || isNaN(outletRadius) || isNaN(fluidDensity)) {
        alert("Please ensure all parameters are valid numeric variables.");
        return;
    }

    const params = {
        inletVelocity,
        pressure,
        inletRadius,
        outletRadius,
        fluidDensity
    };

    localStorage.setItem('simulationParams', JSON.stringify(params));
    window.location.href = 'results.html';
}

// Results Viewer Pipeline
function renderResults() {
    const rawParams = localStorage.getItem('simulationParams');
    if (!rawParams) {
        alert("No active simulation state detected. Redirecting to initialization dashboard.");
        window.location.href = 'index.html';
        return;
    }

    const { inletVelocity, pressure, inletRadius, outletRadius, fluidDensity } = JSON.parse(rawParams);

    // Bind boundary condition inputs to UI for PDF export visibility
    document.getElementById('in-v1').innerText = inletVelocity;
    document.getElementById('in-p1').innerText = pressure;
    document.getElementById('in-r1').innerText = inletRadius;
    document.getElementById('in-r2').innerText = outletRadius;
    document.getElementById('in-rho').innerText = fluidDensity;

    // Dynamic Computations
    const inletArea = Math.PI * Math.pow(inletRadius, 2);
    const outletArea = Math.PI * Math.pow(outletRadius, 2);
    const flowRate = inletArea * inletVelocity;
    const outletVelocity = flowRate / outletArea;
    const bernoulliConstant = pressure + 0.5 * fluidDensity * Math.pow(inletVelocity, 2);
    const outletPressure = bernoulliConstant - 0.5 * fluidDensity * Math.pow(outletVelocity, 2);
    const length = 1.0;
    const pressureGradient = (outletPressure - pressure) / length;
    const v1Vector = `${inletVelocity.toFixed(2)}î + 0ĵ`;
    const v2Vector = `${outletVelocity.toFixed(2)}î + 0ĵ`;
    const divergence = 0;
    const efficiency = outletVelocity / inletVelocity;

    let behavior = "";
    if (outletRadius < inletRadius) {
        behavior = "Converging Nozzle (Accelerating Pattern)";
    } else if (outletRadius > inletRadius) {
        behavior = "Diverging Nozzle (Decelerating Pattern)";
    } else {
        behavior = "Uniform Pipe (Static Equilibrium)";
    }

    // Safety Engine
    let safetyStatus = "SAFE";
    let safetyColor = "#10b981";
    let safetyBg = "rgba(16, 185, 129, 0.1)";
    let safetyMessage = "Design is stable and feasible for practical implementation";
    let safetyRecommendation = "";
    let hasRecommendation = false;

    if (outletVelocity > 300) {
        safetyStatus = "UNSAFE";
        safetyColor = "#ef4444"; 
        safetyBg = "rgba(239, 68, 68, 0.2)";
        safetyMessage = "Outlet velocity exceeds safe engineering limits";
        safetyRecommendation = "Suggest increasing outlet radius";
        hasRecommendation = true;
    } else if (outletPressure <= 0) {
        safetyStatus = "UNSAFE";
        safetyColor = "#ef4444";
        safetyBg = "rgba(239, 68, 68, 0.2)";
        safetyMessage = "Pressure too low, risk of cavitation";
        safetyRecommendation = "Suggest reducing inlet velocity";
        hasRecommendation = true;
    } else if (outletRadius < 0.3 * inletRadius) {
        safetyStatus = "WARNING";
        safetyColor = "#f59e0b";
        safetyBg = "rgba(245, 158, 11, 0.2)";
        safetyMessage = "Nozzle is too sharply converging, difficult to manufacture";
        safetyRecommendation = "Suggest gradual taper design";
        hasRecommendation = true;
    } else if (outletVelocity > 150 && outletVelocity <= 300) {
        safetyStatus = "WARNING";
        safetyColor = "#f59e0b";
        safetyBg = "rgba(245, 158, 11, 0.2)";
        safetyMessage = "Moderate high velocity, monitor for turbulence";
        safetyRecommendation = "Suggest slightly increasing outlet radius";
        hasRecommendation = true;
    } else if (outletPressure < 0.5 * pressure) {
        safetyStatus = "WARNING";
        safetyColor = "#f59e0b";
        safetyBg = "rgba(245, 158, 11, 0.2)";
        safetyMessage = "Significant pressure drop across nozzle";
        safetyRecommendation = "Suggest verifying flow stability";
        hasRecommendation = true;
    } else if (efficiency < 0.5) {
        safetyStatus = "WARNING";
        safetyColor = "#f59e0b";
        safetyBg = "rgba(245, 158, 11, 0.2)";
        safetyMessage = "Low efficiency, poor flow performance";
    }

    document.getElementById('res-inlet-area').innerText = inletArea.toFixed(4);
    document.getElementById('res-outlet-area').innerText = outletArea.toFixed(4);
    document.getElementById('res-flow-rate').innerText = flowRate.toFixed(4);
    document.getElementById('res-outlet-velocity').innerText = outletVelocity.toFixed(4);
    document.getElementById('res-outlet-pressure').innerText = outletPressure.toFixed(2);
    document.getElementById('res-bernoulli').innerText = bernoulliConstant.toFixed(2);
    document.getElementById('res-gradient').innerText = pressureGradient.toFixed(2);
    document.getElementById('res-divergence').innerText = divergence.toFixed(2);
    document.getElementById('res-vectors').innerText = `V₁ = ${v1Vector}, V₂ = ${v2Vector}`;
    document.getElementById('res-behavior').innerText = behavior;
    document.getElementById('res-efficiency').innerText = efficiency.toFixed(2);
    
    // Safety Paint
    const safetyEl = document.getElementById('res-safety');
    safetyEl.innerText = safetyStatus;
    safetyEl.style.color = safetyColor;
    safetyEl.style.background = safetyBg;
    
    document.getElementById('res-explanation').innerText = safetyMessage;
    
    const recContainer = document.getElementById('rec-container');
    const recEl = document.getElementById('res-recommendation');
    if (hasRecommendation) {
        recEl.innerText = safetyRecommendation;
        recContainer.style.display = 'flex';
    } else {
        recEl.innerText = "-";
        recContainer.style.display = 'none';
    }
    
    document.getElementById('results-panel').style.display = 'block';

    // Hook Data
    renderCharts(inletVelocity, outletVelocity, pressure, outletPressure);
    initAnimation(inletRadius, outletRadius, inletVelocity, outletVelocity);
    
    // Save Simulation to History
    saveSimulationHistory({
        inletVelocity, outletVelocity, pressure, outletPressure, inletRadius, outletRadius, fluidDensity,
        inletArea, outletArea, flowRate, bernoulliConstant, pressureGradient, divergence, v1Vector, v2Vector, efficiency, behavior, safetyStatus
    });
}

function saveSimulationHistory(results) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return; // Only save if user is logged in
    
    // Check if we've already saved this exact set of parameters for this session to avoid duplicates on refresh
    const lastSaved = sessionStorage.getItem('lastSavedSimulation');
    const currentParams = localStorage.getItem('simulationParams');
    if (lastSaved === currentParams) return;

    fetch('http://localhost:5000/api/simulations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id: user.id,
            params: JSON.parse(currentParams),
            results: results
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.message) {
            sessionStorage.setItem('lastSavedSimulation', currentParams);
        }
    })
    .catch(err => console.error("Could not save simulation history", err));
}

function initAnimation(r1, r2, v1, v2) {
    const canvas = document.getElementById('flowCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    
    document.getElementById('animation-overlay').style.display = 'none';

    if (animationFrameId) cancelAnimationFrame(animationFrameId);

    activeParticles = [];
    const numParticles = 120;
    for (let i = 0; i < numParticles; i++) {
        activeParticles.push(spawnParticle(canvas.width));
    }

    function spawnParticle(width, startAtZero = false) {
        return {
            x: startAtZero ? 0 : Math.random() * width,
            yNorm: Math.random(), 
            size: Math.random() * 2 + 1.5 
        };
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const maxR = Math.max(r1, r2);
        const scale = (canvas.height * 0.35) / maxR;
        const scaledR1 = r1 * scale;
        const scaledR2 = r2 * scale;
        const centerY = canvas.height / 2;

        ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
        ctx.beginPath();
        ctx.moveTo(0, centerY - scaledR1);
        ctx.lineTo(canvas.width, centerY - scaledR2);
        ctx.lineTo(canvas.width, centerY + scaledR2);
        ctx.lineTo(0, centerY + scaledR1);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = "rgba(148, 163, 184, 0.8)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, centerY - scaledR1);
        ctx.lineTo(canvas.width, centerY - scaledR2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, centerY + scaledR1);
        ctx.lineTo(canvas.width, centerY + scaledR2);
        ctx.stroke();

        ctx.fillStyle = "#6ee7b7";
        for (let i = 0; i < activeParticles.length; i++) {
            let p = activeParticles[i];
            let progress = p.x / canvas.width;
            let currentLocalVelocity = v1 + (v2 - v1) * progress;
            let pixelSpeed = currentLocalVelocity * 1.5; 
            
            p.x += Math.max(0.5, pixelSpeed);

            let currentR = scaledR1 + (scaledR2 - scaledR1) * progress;
            let actualY = centerY + (p.yNorm - 0.5) * 2 * currentR;

            ctx.beginPath();
            ctx.arc(p.x, actualY, p.size, 0, Math.PI * 2);
            ctx.fill();

            if (p.x > canvas.width || p.x < 0) {
                activeParticles[i] = spawnParticle(canvas.width, true);
            }
        }

        animationFrameId = requestAnimationFrame(draw);
    }
    draw();
}

function renderCharts(v1, v2, p1, p2) {
    document.getElementById('charts-panel').style.display = 'grid';
    
    const ctxVel = document.getElementById('velocityChart').getContext('2d');
    const ctxPres = document.getElementById('pressureChart').getContext('2d');

    if (velocityChartInstance) velocityChartInstance.destroy();
    if (pressureChartInstance) pressureChartInstance.destroy();

    velocityChartInstance = new Chart(ctxVel, {
        type: 'line',
        data: {
            labels: ['Inlet (x=0)', 'Outlet (x=L)'],
            datasets: [{
                label: 'Velocity (m/s)',
                data: [v1, v2],
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.3,
                fill: true
            }]
        },
        options: { responsive: true, plugins: { legend: { labels: { color: '#f8fafc' } } }, scales: { x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }, y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } } } }
    });

    pressureChartInstance = new Chart(ctxPres, {
        type: 'line',
        data: {
            labels: ['Inlet (x=0)', 'Outlet (x=L)'],
            datasets: [{
                label: 'Pressure (Pa)',
                data: [p1, p2],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.3,
                fill: true
            }]
        },
        options: { responsive: true, plugins: { legend: { labels: { color: '#f8fafc' } } }, scales: { x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }, y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } } } }
    });
}

// PDF Exporter
async function downloadReport() {
    if (!window.jspdf) {
        alert("PDF logic libraries are loading via CDN. Please wait a second and try again.");
        return;
    }
    const { jsPDF } = window.jspdf;
    
    // Create new document (A4 format)
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Styling constants
    const margin = 20;
    let yPos = 20;
    const getVal = (id) => {
        const el = document.getElementById(id);
        return el ? el.innerText : '-';
    };
    
    // Title
    pdf.setFontSize(22);
    pdf.setTextColor(15, 23, 42); 
    pdf.text("Fluid Dynamics Analysis", margin, yPos);
    
    yPos += 10;
    pdf.setFontSize(12);
    pdf.setTextColor(100, 116, 139);
    pdf.text("Simulation Predictions and Reporting", margin, yPos);
    
    yPos += 20;
    
    // --- Input Parameters ---
    pdf.setFontSize(16);
    pdf.setTextColor(15, 23, 42);
    pdf.text("Input Boundary Conditions", margin, yPos);
    yPos += 10;
    
    pdf.setFontSize(11);
    pdf.setTextColor(71, 85, 105);
    pdf.text(`Inlet Velocity (V1): ${getVal('in-v1')} m/s`, margin, yPos);
    pdf.text(`Inlet Pressure (P1): ${getVal('in-p1')} Pa`, margin + 85, yPos);
    yPos += 8;
    pdf.text(`Inlet Radius (r1): ${getVal('in-r1')} m`, margin, yPos);
    pdf.text(`Outlet Radius (r2): ${getVal('in-r2')} m`, margin + 85, yPos);
    yPos += 8;
    pdf.text(`Fluid Density: ${getVal('in-rho')} kg/m^3`, margin, yPos);
    
    yPos += 20;
    
    // --- Physics Evaluation Matrix ---
    pdf.setFontSize(16);
    pdf.setTextColor(15, 23, 42);
    pdf.text("Physics Evaluation Matrix", margin, yPos);
    yPos += 10;
    
    pdf.setFontSize(11);
    pdf.setTextColor(71, 85, 105);
    
    pdf.text(`Inlet Area: ${getVal('res-inlet-area')} m^2`, margin, yPos);
    pdf.text(`Outlet Area: ${getVal('res-outlet-area')} m^2`, margin + 85, yPos);
    yPos += 8;
    pdf.text(`Flow Rate (Q): ${getVal('res-flow-rate')} m^3/s`, margin, yPos);
    pdf.text(`Outlet Velocity: ${getVal('res-outlet-velocity')} m/s`, margin + 85, yPos);
    yPos += 8;
    pdf.text(`Outlet Pressure (P2): ${getVal('res-outlet-pressure')} Pa`, margin, yPos);
    pdf.text(`Bernoulli Constant: ${getVal('res-bernoulli')} J/m^3`, margin + 85, yPos);
    yPos += 8;
    pdf.text(`Pressure Gradient: ${getVal('res-gradient')} Pa/m`, margin, yPos);
    pdf.text(`Divergence: ${getVal('res-divergence')} s^-1`, margin + 85, yPos);
    yPos += 8;
    pdf.text(`Velocity Vectors: ${getVal('res-vectors')}`, margin, yPos);
    
    yPos += 15;
    pdf.text(`Flow Behavior: ${getVal('res-behavior')}`, margin, yPos);
    yPos += 8;
    pdf.text(`Efficiency (V2 / V1): ${getVal('res-efficiency')}`, margin, yPos);
    yPos += 15;
    
    // Safety Status Prediction
    pdf.setFontSize(14);
    const safetyText = getVal('res-safety');
    if (safetyText === "UNSAFE") {
        pdf.setTextColor(239, 68, 68); 
    } else if (safetyText === "WARNING") {
        pdf.setTextColor(245, 158, 11); 
    } else {
        pdf.setTextColor(16, 185, 129); 
    }
    pdf.text(`Engine Safety Prediction: ${safetyText}`, margin, yPos);
    
    yPos += 8;
    pdf.setFontSize(11);
    pdf.setTextColor(71, 85, 105);
    pdf.text(`Explanation: ${getVal('res-explanation')}`, margin, yPos);
    
    const recText = getVal('res-recommendation');
    if (recText && recText !== "-") {
        yPos += 8;
        pdf.setTextColor(96, 165, 250); // Warning/Recommendation color
        pdf.text(`Recommendation: ${recText}`, margin, yPos);
    }
    
    yPos += 15;
    
    // --- Charts ---
    if (yPos > 200) {
        pdf.addPage();
        yPos = 20;
    }
    
    pdf.setFontSize(16);
    pdf.setTextColor(15, 23, 42);
    pdf.text("Visual Data Charts", margin, yPos);
    yPos += 10;
    
    try {
        const velCanvas = document.getElementById('velocityChart');
        const presCanvas = document.getElementById('pressureChart');
        
        if (velCanvas) {
            pdf.setFillColor(30, 41, 59); // Dark background to match UI
            pdf.rect(margin, yPos, 80, 45, 'F');
            const velImg = velCanvas.toDataURL('image/png', 1.0);
            pdf.addImage(velImg, 'PNG', margin, yPos, 80, 45);
        }
        
        if (presCanvas) {
            pdf.setFillColor(30, 41, 59);
            pdf.rect(margin + 85, yPos, 80, 45, 'F');
            const presImg = presCanvas.toDataURL('image/png', 1.0);
            pdf.addImage(presImg, 'PNG', margin + 85, yPos, 80, 45);
        }
    } catch (e) {
        console.warn("Could not capture charts for PDF:", e);
    }
    
    pdf.save('Fluid_Dynamics_Analysis_Report.pdf');
}
