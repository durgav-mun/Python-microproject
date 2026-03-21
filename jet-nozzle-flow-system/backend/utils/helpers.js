/**
 * Utility functions for the backend
 */

const helpers = {
  /**
   * Convert Celsius to Fahrenheit
   */
  celsiusToFahrenheit: (celsius) => {
    return (celsius * 9/5) + 32;
  },

  /**
   * Convert Fahrenheit to Celsius
   */
  fahrenheitToCelsius: (fahrenheit) => {
    return (fahrenheit - 32) * 5/9;
  },

  /**
   * Convert PSI to Pascal
   */
  psiToPA: (psi) => {
    return psi * 6894.757;
  },

  /**
   * Convert Pascal to PSI
   */
  paToPSI: (pa) => {
    return pa / 6894.757;
  },

  /**
   * Validate email format
   */
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Generate timestamp
   */
  getTimestamp: () => {
    return new Date().toISOString();
  },

  /**
   * Round number to specified decimal places
   */
  roundTo: (number, decimals) => {
    return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
  },

  /**
   * Validate required fields in object
   */
  validateRequired: (obj, requiredFields) => {
    const missing = requiredFields.filter(field => !obj[field]);
    return missing.length === 0 ? true : missing;
  },

  /**
   * Generate error response
   */
  errorResponse: (message, status = 500) => {
    return { success: false, error: message, status };
  },

  /**
   * Generate success response
   */
  successResponse: (data, message = 'Success') => {
    return { success: true, data, message };
  },
};

module.exports = helpers;
