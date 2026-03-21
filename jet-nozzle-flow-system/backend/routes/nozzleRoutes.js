const express = require('express');
const router = express.Router();
const NozzleController = require('../controllers/nozzleController');

// GET all nozzles
router.get('/', NozzleController.getAllNozzles);

// GET nozzle by ID
router.get('/:id', NozzleController.getNozzleById);

// POST create new nozzle
router.post('/', NozzleController.createNozzle);

// PUT update nozzle
router.put('/:id', NozzleController.updateNozzle);

// DELETE nozzle
router.delete('/:id', NozzleController.deleteNozzle);

module.exports = router;
