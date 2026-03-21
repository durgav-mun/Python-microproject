const pool = require('../config/db');

class VectorModel {
  static async saveVectorAnalysis(analysisData) {
    const { nozzle_id, flow_id, velocity_x, velocity_y, velocity_z, magnitude } = analysisData;
    const [result] = await pool.execute(
      'INSERT INTO vector_analysis (nozzle_id, flow_id, velocity_x, velocity_y, velocity_z, magnitude, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [nozzle_id, flow_id, velocity_x, velocity_y, velocity_z, magnitude]
    );
    return result;
  }

  static async getVectorAnalysis(nozzleId, limit = 100) {
    const [rows] = await pool.execute(
      'SELECT * FROM vector_analysis WHERE nozzle_id = ? ORDER BY created_at DESC LIMIT ?',
      [nozzleId, limit]
    );
    return rows;
  }

  static async getVectorById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM vector_analysis WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async deleteOldAnalysis(daysOld = 30) {
    const [result] = await pool.execute(
      'DELETE FROM vector_analysis WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)',
      [daysOld]
    );
    return result;
  }
}

module.exports = VectorModel;
