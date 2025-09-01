const express = require('express');
const router = express.Router();
const masterController = require('../controllers/master.controller');

// Get master data by type (columns, rows, metadata)
router.get('/:masterType', masterController.getMasterData);

// Create new master record
router.post('/:masterType', masterController.createMasterRecord);

// Update master record
router.put('/:masterType', masterController.updateMasterRecord);

// Delete master record
router.delete('/:masterType', masterController.deleteMasterRecord);

module.exports = router;
