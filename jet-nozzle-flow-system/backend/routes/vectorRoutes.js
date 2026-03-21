const express = require('express');
const router = express.Router();
const VectorController = require('../controllers/vectorController');

// POST calculate vectors
router.post('/calculate', VectorController.calculateVectors);

// GET vector analysis
router.get('/analysis', VectorController.getVectorAnalysis);

// GET vector by ID
router.get('/:id', VectorController.getVectorById);

module.exports = router;
