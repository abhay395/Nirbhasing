const Slider = require('../models/Slider'); // Mongoose model

// GET: Fetch all slider images
exports.getSlider = async (req, res) => {
    try {
        const sliders = await Slider.find();
        res.json(sliders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching slider images' });
    }
}

// POST: Add new slider image (admin)
exports.addSlider = async (req, res) => {
    const { imageUrl, caption } = req.body;

    try {
        const newSlider = new Slider({ imageUrl, caption });
        await newSlider.save();
        res.json({ message: 'Slider image added successfully', newSlider });
    } catch (error) {
        res.status(500).json({ message: 'Error adding slider image' });
    }  
}

// DELETE: Remove slider image (admin)
exports.removeSlider = async (req, res) => {
    try {
        await Slider.findByIdAndDelete(req.params.id);
        res.json({ message: 'Slider image deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting slider image' });
    }
}
