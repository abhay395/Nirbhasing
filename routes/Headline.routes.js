const express = require('express');
const router = express.Router();
const {
    createHeadline,
    getHeadlines,
    getHeadlineById,
    updateHeadline,
    deleteHeadline
} = require('../controller/Headline.controller');

// Route to create a new headline
router.post('/', createHeadline);

// Route to get all headlines
router.get('/', getHeadlines);

// Route to get a single headline by ID
router.get('/:id', getHeadlineById);

// Route to update a headline by ID
router.put('/:id', updateHeadline);

// Route to delete a headline by ID
router.delete('/:id', deleteHeadline);

exports.router = router;
