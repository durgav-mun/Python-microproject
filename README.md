# PYTHON - MICROPROJECT
# PROJECT OVERVIEW
## FLUID SIMULATOR

This is a web app I built that simulates fluid flow through a pipe using Bernoulli's equation. You enter some values like velocity and pressure, and it calculates what happens at the outlet and tells you if the system is safe or not.

---

## WHAT IT DOES

- Register and log in to your account
- Enter fluid parameters (velocity, pressure, pipe size, density)
- Get calculated results like outlet velocity, flow rate, outlet pressure
- See a live animation of the flow
- View charts comparing inlet vs outlet values
- Download the results as a PDF
- Check your past simulations in the history page

---

## TECH USED

- **Frontend** - plain HTML, CSS, JavaScript
- **Backend** - Python with Flask
- **Database** - MongoDB Atlas
- **Charts** - Chart.js
- **PDF export** - jsPDF + html2canvas

---

## FILE STRUCTURE

```
project/
│
backend/
├── routes/
│   ├── auth_routes.py
│   └── simulation_routes.py
├── models/
│   ├── user_model.py
│   └── simulation_model.py
└── app.py
    db.py
    requirements.txt
    .env
└── frontend/
    ├── login.html      # login page
    ├── register.html   # sign up page
    ├── index.html      # input form page
    ├── results.html    # shows the results and charts
    ├── history.html    # shows past simulations
    ├── css/style.css   # styling for all pages
    └── js/
        ├── auth.js        # login/register calls
        └── simulation.js  # submits simulation, renders results, exports PDF
```

---

## HOW TO DO IT

1. Clone the repo
2. Go into the backend folder and create a virtual environment
   ```
   python -m venv venv
   venv\Scripts\activate
   ```
3. Install the requirements
   ```
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the backend folder and add your MongoDB URI
   ```
   MONGO_URI=your_mongodb_connection_string_here
   ```
5. Run the server
   ```
   python app.py
   ```
6. Open `frontend/login.html` in your browser

---

## MAIN CONCEPTS USED

### 1. Cross-sectional Area
The area of the circular pipe opening at the inlet and outlet is calculated using the standard circle area formula:
```
A = π × r²
```
- `r` is the radius of the pipe
- This gives us the inlet area (A1) and outlet area (A2)

---

### 2. Continuity Equation
This comes from the conservation of mass. For an incompressible fluid (like water), whatever flows in must flow out. So if the pipe gets narrower, the fluid speeds up.
```
A1 × V1 = A2 × V2
```
Rearranged to find the outlet velocity:
```
V2 = (A1 / A2) × V1
```
- `A1`, `A2` = inlet and outlet cross-sectional areas
- `V1`, `V2` = inlet and outlet velocities

---

### 3. Volumetric Flow Rate
This tells us how much fluid passes through the pipe per second:
```
Q = A1 × V1
```
- Result is in m³/s
- Since the continuity equation holds, `Q` is the same at both ends

---

### 4. Bernoulli's Equation
This is the core of the simulation. It describes the trade-off between pressure and velocity in a flowing fluid — when velocity increases, pressure drops, and vice versa.
```
P1 + ½ρV1² = P2 + ½ρV2²
```
Rearranged to find outlet pressure:
```
P2 = P1 + ½ × ρ × (V1² - V2²)
```
- `P1`, `P2` = inlet and outlet pressure (Pa)
- `ρ` = fluid density (kg/m³)
- `V1`, `V2` = inlet and outlet velocity (m/s)

---

### 5. Bernoulli Constant
This is just the total energy per unit volume at any point in the flow. For an ideal fluid it stays constant throughout:
```
B = P + ½ × ρ × V²
```
Used to verify that energy is conserved in the simulation.

---

### 6. Pressure Gradient
This tells us how quickly pressure changes along the pipe:
```
∇P = (P1 - P2) / L
```
- `L` is the pipe length (assumed constant in the simulation)
- A large pressure gradient means the pressure drops steeply — which can stress the pipe

---

### 7. Divergence of Velocity (∇·V)
In a perfectly incompressible fluid, the divergence should be zero — meaning fluid isn't being created or destroyed anywhere inside the pipe. The app estimates it as:
```
∇·V = V2 - V1
```
A value close to zero means the simulation is physically consistent. A large value would indicate a problem with the inputs.

---

### 8. Velocity Efficiency Ratio
A simple ratio to show how much the fluid accelerated through the pipe:
```
Efficiency = V2 / V1
```
- Greater than 1 means the fluid sped up (narrower outlet)
- Less than 1 means it slowed down (wider outlet)

---

### 9. Safety Evaluation
The app checks the computed values against safe operating thresholds and classifies the result as:
- **SAFE** — all values within normal range
- **WARNING** — some values are borderline
- **UNSAFE** — outlet pressure is negative, velocity is dangerously high, or divergence is too large

---

## NOTES

- Don't commit your `.env` file — it has your database credentials in it
- The history page won't create a duplicate when you view an old simulation
- The `.gitignore` should include `venv/`, `__pycache__/`, `*.pyc`, and `.env`
