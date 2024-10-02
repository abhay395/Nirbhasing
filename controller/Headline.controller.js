const { Headline } = require('../models/Headline');

// Create a new headline
const createHeadline = async (req, res) => {
    try {
        const { type, description } = req.body;
        const newHeadline = new Headline({ type, description });
        await newHeadline.save();
        res.status(201).json(newHeadline);
    } catch (error) {
        res.status(500).json({ message: 'Error creating headline', error });
    }
};

// Get all headlines
const getHeadlines = async (req, res) => {
    try {
        const headlines = await Headline.aggregate(
            [
        {
            $group: {
                _id: null,
                NewsHeadline: {
                    $push: {
                        $cond: [{ $eq: ["$type", "News"] }, { description: "$description", type: "$type" }, null]
                    }
                },
                Event: {
                    $push: {
                        $cond: [{ $eq: ["$type", "Event"] }, { description: "$description", type: "$type" }, null]
                    }
                },
                Reqrutement: {
                    $push: {
                        $cond: [{ $eq: ["$type", "Requritment"] }, { description: "$description", type: "$type" }, null]
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                NewsHeadline: {
                    $filter: {
                        input: "$NewsHeadline",
                        as: "headline",
                        cond: { $ne: ["$$headline", null] }
                    }
                },
                Event: {
                    $filter: {
                        input: "$Event",
                        as: "headline",
                        cond: { $ne: ["$$headline", null] }
                    }
                },
                Reqrutement: {
                    $filter: {
                        input: "$Reqrutement",
                        as: "headline",
                        cond: { $ne: ["$$headline", null] }
                    }
                }
            }
        }
        ]);
        res.status(200).json(headlines);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching headlines', error });
    }
};

// Get a single headline by ID
const getHeadlineById = async (req, res) => {
    try {
        const { id } = req.params;
        const headline = await Headline.findById(id);
        if (!headline) {
            return res.status(404).json({ message: 'Headline not found' });
        }
        res.status(200).json(headline);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching headline', error });
    }
};

// Update a headline by ID
const updateHeadline = async (req, res) => {
    try {
        const { id } = req.params;
        const { type, item } = req.body;
        const updatedHeadline = await Headline.findByIdAndUpdate(id, { type, item }, { new: true });
        if (!updatedHeadline) {
            return res.status(404).json({ message: 'Headline not found' });
        }
        res.status(200).json(updatedHeadline);
    } catch (error) {
        res.status(500).json({ message: 'Error updating headline', error });
    }
};

// Delete a headline by ID
const deleteHeadline = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedHeadline = await Headline.findByIdAndDelete(id);
        if (!deletedHeadline) {
            return res.status(404).json({ message: 'Headline not found' });
        }
        res.status(200).json({ message: 'Headline deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting headline', error });
    }
};

module.exports = {
    createHeadline,
    getHeadlines,
    getHeadlineById,
    updateHeadline,
    deleteHeadline
}