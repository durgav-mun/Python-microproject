const express = require('express');
const router = express.Router();
const FlowController = require('../controllers/flowController');

// POST record flow data
router.post('/', FlowController.recordFlow);

// GET flow data with time range
router.get('/data', FlowController.getFlowData);

// GET latest flow data
router.get('/latest', FlowController.getLatestFlow);

// GET flow statistics
router.get('/statistics', FlowController.getStatistics);

module.exports = router;
