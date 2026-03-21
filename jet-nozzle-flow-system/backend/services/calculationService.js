class CalculationService {
  /**
   * Calculate velocity vectors from magnitude and angle
   * @param {number} magnitude - Total velocity magnitude (m/s)
   * @param {number} angle - Angle in degrees (0-360)
   * @returns {object} Vector components {x, y, z, magnitude}
   */
  static calculateVelocityVectors(magnitude, angle) {
    const angleRad = (angle * Math.PI) / 180;
    
    return {
      x: magnitude * Math.cos(angleRad),
      y: magnitude * Math.sin(angleRad),
      z: 0, // Assuming 2D flow, z is 0
      magnitude: magnitude,
    };
  }

  /**
   * Calculate flow rate from velocity and cross-sectional area
   * @param {number} velocity - Velocity (m/s)
   * @param {number} diameter - Nozzle diameter (mm)
   * @returns {number} Flow rate (L/min)
   */
  static calculateFlowRate(velocity, diameter) {
    const radiusM = (diameter / 2) / 1000; // Convert mm to m
    const areaM2 = Math.PI * radiusM * radiusM;
    const flowM3PerSec = velocity * areaM2;
    const flowLPerMin = flowM3PerSec * 60 * 1000; // Convert to L/min
    return flowLPerMin;
  }

  /**
   * Calculate Reynolds number to determine flow type
   * @param {number} density - Fluid density (kg/m³)
   * @param {number} velocity - Velocity (m/s)
   * @param {number} diameter - Characteristic length (mm)
   * @param {number} viscosity - Dynamic viscosity (Pa·s)
   * @returns {number} Reynolds number
   */
  static calculateReynoldsNumber(density, velocity, diameter, viscosity) {
    const diameterM = diameter / 1000; // Convert to meters
    return (density * velocity * diameterM) / viscosity;
  }

  /**
   * Determine flow regime based on Reynolds number
   * @param {number} reynoldsNumber - Reynolds number
   * @returns {string} Flow regime (Laminar, Transitional, Turbulent)
   */
  static determineFlowRegime(reynoldsNumber) {
    if (reynoldsNumber < 2300) return 'Laminar';
    if (reynoldsNumber < 4000) return 'Transitional';
    return 'Turbulent';
  }

  /**
   * Calculate pressure drop using Darcy-Weisbach equation
   * @param {number} friction - Friction factor
   * @param {number} length - Pipe length (mm)
   * @param {number} diameter - Pipe diameter (mm)
   * @param {number} velocity - Flow velocity (m/s)
   * @param {number} density - Fluid density (kg/m³)
   * @returns {number} Pressure drop (Pa)
   */
  static calculatePressureDrop(friction, length, diameter, velocity, density) {
    const lengthM = length / 1000;
    const diameterM = diameter / 1000;
    return (friction * (lengthM / diameterM) * density * (velocity * velocity)) / 2;
  }
}

module.exports = CalculationService;
