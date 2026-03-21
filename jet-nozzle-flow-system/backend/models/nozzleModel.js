const pool = require('../config/db');

class NozzleModel {
  static async create(nozzleData) {
    const { name, diameter, length, angle, material, description } = nozzleData;
    const [result] = await pool.execute(
      'INSERT INTO nozzles (name, diameter, length, angle, material, description, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [name, diameter, length, angle, material, description]
    );
    return result;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM nozzles WHERE id = ?', [id]);
    return rows[0];
  }

  static async findAll() {
    const [rows] = await pool.execute('SELECT * FROM nozzles ORDER BY created_at DESC');
    return rows;
  }

  static async update(id, nozzleData) {
    const { name, diameter, length, angle, material, description } = nozzleData;
    const [result] = await pool.execute(
      'UPDATE nozzles SET name = ?, diameter = ?, length = ?, angle = ?, material = ?, description = ? WHERE id = ?',
      [name, diameter, length, angle, material, description, id]
    );
    return result;
  }

  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM nozzles WHERE id = ?', [id]);
    return result;
  }
}

module.exports = NozzleModel;
