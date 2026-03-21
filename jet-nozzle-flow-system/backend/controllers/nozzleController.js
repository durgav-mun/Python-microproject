const NozzleModel = require('../models/nozzleModel');

class NozzleController {
  static async getAllNozzles(req, res) {
    try {
      const nozzles = await NozzleModel.findAll();
      res.json({ success: true, data: nozzles });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getNozzleById(req, res) {
    try {
      const { id } = req.params;
      const nozzle = await NozzleModel.findById(id);
      if (!nozzle) {
        return res.status(404).json({ success: false, error: 'Nozzle not found' });
      }
      res.json({ success: true, data: nozzle });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async createNozzle(req, res) {
    try {
      const result = await NozzleModel.create(req.body);
      res.status(201).json({ success: true, data: { id: result.insertId, ...req.body } });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async updateNozzle(req, res) {
    try {
      const { id } = req.params;
      await NozzleModel.update(id, req.body);
      res.json({ success: true, message: 'Nozzle updated successfully' });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async deleteNozzle(req, res) {
    try {
      const { id } = req.params;
      await NozzleModel.delete(id);
      res.json({ success: true, message: 'Nozzle deleted successfully' });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

module.exports = NozzleController;
