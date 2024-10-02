const express = require("express");
const router = express.Router();
const Research = require("../models/Reserch");
const { uploadOncloudinary } = require("../utils/cloudinary");

const addResearch = async (req, res) => {
  const { type, title, description } = req.body;
  if (type === "Ongoing Research" && !req.file?.path) {
    return res
      .status(400)
      .json({ message: "Image is required for Ongoing Research" });
  }

  if (!type || !title || !description) {
    console.log(req);
    return res.status(400).json({ message: "All fields are required" });
  }
  const researchData = {
    type,
    title,
    description,
  };

  try {
    let result;
    if (req.file?.path) {
      result = await uploadOncloudinary(req.file.path, "image");
      if (result.secure_url) {
        researchData.image = result.secure_url;
      }
      if (!result?.secure_url) {
        return res.status(500).json({ error: "Error uploading image" });
      }
    }
    const newResearch = new Research(researchData);
    await newResearch.save();
    res
      .status(201)
      .json({ message: "Research added successfully", newResearch });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error adding research", error });
  }
};

const getResearch = async (req, res) => {
  try {
    const queryObject = {};
    if (req.query.type) {
      queryObject.type = req.query.type;
    }
    const result = await Research.aggregate([
      {
        $group: {
          _id: null,
          OngoingResearch: {
            $push: {
              $cond: [
                { $eq: ["$type", "Ongoing Research"] },
                {
                  title: "$title",
                  description: "$description",
                  image: "$image",
                },
                null,
              ],
            },
          },
          Publications: {
            $push: {
              $cond: [
                { $eq: ["$type", "Publications"] },
                {
                  title: "$title",
                  description: "$description",
                },
                null,
              ],
            },
          },
          ResearchGroups: {
            $push: {
              $cond: [
                { $eq: ["$type", "Research Groups"] },
                {
                  title: "$title",
                  description: "$description",
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
          OngoingResearch: {
            $filter: {
              input: "$OngoingResearch",
              as: "item",
              cond: { $ne: ["$$item", null] },
            },
          },
          Publications: {
            $filter: {
              input: "$Publications",
              as: "item",
              cond: { $ne: ["$$item", null] },
            },
          },
          ResearchGroups: {
            $filter: {
              input: "$ResearchGroups",
              as: "item",
              cond: { $ne: ["$$item", null] },
            },
          },
        },
      },
      {
        $addFields: {
          OngoingResearch: { type: "Ongoing Research" },
          Publications: { type: "Publications" },
          ResearchGroups: { type: "Research Groups" },
        },
      },
    ]);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching research", error });
  }
};

const deleteResearch = async (req, res) => {
  try {
    // Check if the ID is provided
    const {id} = req.params;
    if (id) {
      return res.status(400).json({ message: "Research ID is required" });
    }
    const result = await Research.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "Research not found" });
    }
    res.status(200).json({ message: "Research deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting research", error });
  }
};
const updateResearch = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Research ID is required" });
    }
    const result = await Research.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!result) {
      return res.status(404).json({ message: "Research not found" });
    }
    res.status(200).json({ message: "Research updated successfully", result });
  } catch (error) {
    res.status(500).json({ message: "Error updating research", error });
  }
}
module.exports = { addResearch, getResearch,deleteResearch };
