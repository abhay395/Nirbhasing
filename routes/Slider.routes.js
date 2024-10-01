// Import necessary modules
const express = require('express');
const router = express.Router();
const {getSlider,addSlider,removeSlider} = require('../controller/Slider.controller');
const Slider = require('../models/Slider'); // Mongoose model

// GET: Fetch all slider images
router.get('/',getSlider);

// POST: Add new slider image (admin)
router.post('/', addSlider);

// DELETE: Remove slider image (admin)
router.delete('/:id',removeSlider);

// Export the router
exports.router = router;