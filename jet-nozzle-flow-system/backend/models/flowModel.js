const pool = require('../config/db');

class FlowModel {
  static async recordFlow(flowData) {
    const { nozzle_id, flow_rate, pressure, temperature, velocity } = flowData;
    const [result] = await pool.execute(
      'INSERT INTO flow_data (nozzle_id, flow_rate, pressure, temperature, velocity, recorded_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [nozzle_id, flow_rate, pressure, temperature, velocity]
    );
    return result;
  }

  static async getFlowData(nozzleId, timeRange = 24) {
    const [rows] = await pool.execute(
      'SELECT * FROM flow_data WHERE nozzle_id = ? AND recorded_at >= DATE_SUB(NOW(), INTERVAL ? HOUR) ORDER BY recorded_at DESC',
      [nozzleId, timeRange]
    );
    return rows;
  }

  static async getLatestFlow(nozzleId) {
    const [rows] = await pool.execute(
      'SELECT * FROM flow_data WHERE nozzle_id = ? ORDER BY recorded_at DESC LIMIT 1',
      [nozzleId]
    );
    return rows[0];
  }

  static async getStatistics(nozzleId, timeRange = 24) {
    const [rows] = await pool.execute(
      `SELECT 
        AVG(flow_rate) as avg_flow_rate,
        MAX(flow_rate) as max_flow_rate,
        MIN(flow_rate) as min_flow_rate,
        AVG(pressure) as avg_pressure,
        MAX(pressure) as max_pressure,
        MIN(pressure) as min_pressure
      FROM flow_data 
      WHERE nozzle_id = ? AND recorded_at >= DATE_SUB(NOW(), INTERVAL ? HOUR)`,
      [nozzleId, timeRange]
    );
    return rows[0];
  }
}

module.exports = FlowModel;
