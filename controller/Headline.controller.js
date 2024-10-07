const { Headline } = require("../models/Headline");
const { uploadOncloudinary } = require("../utils/cloudinary");

// Create a new headline
const createHeadline = async (req, res) => {
  try {
    const { type, description } = req.body;

    if (!type || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const addObj = { type, description };

    if (type === "Certificate") {
      if (!req.file) {
        return res.status(400).json({ message: "PDF is required" });
      }

      const result = await uploadOncloudinary(req, "application/pdf");

      if (!result?.secure_url) {
        return res.status(500).json({ error: result.error });
      }

      addObj.pdf = result.secure_url;
    }

    const newHeadline = new Headline(addObj);
    await newHeadline.save();

    res.status(201).json({
      message: "Headline created successfully",
      headlines: newHeadline,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating headline", error: error.message });
  }
};

// Get all headlines
const getHeadlines = async (req, res) => {
  try {
    const { type } = req.query;
    if (type) {
      const headlines = await Headline.find({ type });
      return res.status(200).json(headlines);
    }
    const headlines = await Headline.aggregate([
      {
        $group: {
          _id: null,
          NewsHeadline: {
            $push: {
              $cond: [
                { $eq: ["$type", "News"] },
                { description: "$description", type: "$type", _id: "$_id",timestamp: "$timestamp" },
                null,
              ],
            },
          },
          Event: {
            $push: {
              $cond: [
                { $eq: ["$type", "Event"] },
                { description: "$description", type: "$type", _id: "$_id" ,timestamp: "$timestamp"},
                null,
              ],
            },
          },
          Certificate: {
            $push: {
              $cond: [
                { $eq: ["$type", "Certificate"] },
                {
                  description: "$description",
                  type: "$type",
                  _id: "$_id",
                  timestamp: "$timestamp",
                  pdf: "$pdf",
                },
                null,
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          NewsHeadline: {
            $filter: {
              input: "$NewsHeadline",
              as: "headline",
              cond: { $ne: ["$$headline", null] },
            },
          },
          Event: {
            $filter: {
              input: "$Event",
              as: "headline",
              cond: { $ne: ["$$headline", null] },
            },
          },
          Certificate: {
            $filter: {
              input: "$Certificate",
              as: "headline",
              cond: { $ne: ["$$headline", null] },
            },
          },
        },
      },
    ]);
    res.status(200).json(headlines);
  } catch (error) {
    res.status(500).json({ message: "Error fetching headlines", error });
  }
};

// Get a single headline by ID
const getHeadlineById = async (req, res) => {
  try {
    const { id } = req.params;
    const headline = await Headline.findById(id);
    if (!headline) {
      return res.status(404).json({ message: "Headline not found" });
    }
    res.status(200).json(headline);
  } catch (error) {
    res.status(500).json({ message: "Error fetching headline", error });
  }
};

// Update a headline by ID
const updateHeadline = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }
    
    const { description } = req.body;
    const item = {
      description,
    };
    if (req.file) {
      const result = await uploadOncloudinary(req, "application/pdf");
      if (!result?.secure_url) {
        return res.status(500).json({ error: result.error });
      }
      item.pdf = result.secure_url;
    }
    const updatedHeadline = await Headline.findByIdAndUpdate(
      id,
     item,
      { new: true }
    );
    if (!updatedHeadline) {
      return res.status(404).json({ message: "Headline not found" });
    }
    res.status(200).json({message:"Headline update succesfully",headline:updatedHeadline});
  } catch (error) {
    res.status(500).json({ message: "Error updating headline", error });
  }
};

// Delete a headline by ID
const deleteHeadline = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedHeadline = await Headline.findByIdAndDelete(id);
    if (!deletedHeadline) {
      return res.status(404).json({ message: "Headline not found" });
    }
    res.status(200).json({ message: "Headline deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting headline", error });
  }
};

module.exports = {
  createHeadline,
  getHeadlines,
  getHeadlineById,
  updateHeadline,
  deleteHeadline,
};
