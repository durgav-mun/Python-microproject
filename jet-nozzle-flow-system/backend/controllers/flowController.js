const FlowModel = require('../models/flowModel');

class FlowController {
  static async recordFlow(req, res) {
    try {
      const result = await FlowModel.recordFlow(req.body);
      res.status(201).json({ success: true, id: result.insertId });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getFlowData(req, res) {
    try {
      const { nozzleId, timeRange = 24 } = req.query;
      if (!nozzleId) {
        return res.status(400).json({ success: false, error: 'nozzleId is required' });
      }
      const data = await FlowModel.getFlowData(nozzleId, timeRange);
      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getLatestFlow(req, res) {
    try {
      const { nozzleId } = req.query;
      if (!nozzleId) {
        return res.status(400).json({ success: false, error: 'nozzleId is required' });
      }
      const data = await FlowModel.getLatestFlow(nozzleId);
      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getStatistics(req, res) {
    try {
      const { nozzleId, timeRange = 24 } = req.query;
      if (!nozzleId) {
        return res.status(400).json({ success: false, error: 'nozzleId is required' });
      }
      const stats = await FlowModel.getStatistics(nozzleId, timeRange);
      res.json({ success: true, data: stats });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

module.exports = FlowController;
