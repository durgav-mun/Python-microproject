const VectorModel = require('../models/vectorModel');
const calculationService = require('../services/calculationService');

class VectorController {
  static async calculateVectors(req, res) {
    try {
      const { nozzle_id, flow_id, velocity, angle, pressure } = req.body;
      
      // Call calculation service
      const vectors = calculationService.calculateVelocityVectors(velocity, angle);
      
      // Save results
      const analysisData = {
        nozzle_id,
        flow_id,
        velocity_x: vectors.x,
        velocity_y: vectors.y,
        velocity_z: vectors.z,
        magnitude: vectors.magnitude,
      };
      
      const result = await VectorModel.saveVectorAnalysis(analysisData);
      res.status(201).json({ success: true, data: { id: result.insertId, ...analysisData } });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getVectorAnalysis(req, res) {
    try {
      const { nozzleId, limit = 100 } = req.query;
      if (!nozzleId) {
        return res.status(400).json({ success: false, error: 'nozzleId is required' });
      }
      const data = await VectorModel.getVectorAnalysis(nozzleId, limit);
      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getVectorById(req, res) {
    try {
      const { id } = req.params;
      const data = await VectorModel.getVectorById(id);
      if (!data) {
        return res.status(404).json({ success: false, error: 'Vector analysis not found' });
      }
      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

module.exports = VectorController;
