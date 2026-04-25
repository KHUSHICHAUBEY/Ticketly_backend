const Label = require("../models/labels");

// CREATE LABEL
const createLabel = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: 0,
        message: "Label name is required"
      });
    }

    const existing = await Label.findOne({ name });

    if (existing) {
      return res.status(400).json({
        success: 0,
        message: "Label already exists"
      });
    }

    const label = await Label.create({
      name,
      description: description || "",
      createdBy: req.authUser?._id,
      updatedBy: req.authUser?._id
    });

    return res.status(200).json({
      success: 1,
      message: "Label created successfully",
      data: label
    });

  } catch (error) {
    return res.status(500).json({
      success: 0,
      message: error.message
    });
  }
};


// GET ALL LABELS
const getAllLabels = async (req, res) => {
  try {
    const labels = await Label.find();

    return res.status(200).json({
      success: 1,
      data: labels
    });

  } catch (error) {
    return res.status(500).json({
      success: 0,
      message: error.message
    });
  }
};


// UPDATE LABEL
const updateLabel = async (req, res) => {
  try {
    const { label_id, name, description } = req.body;

    if (!label_id) {
      return res.status(400).json({
        success: 0,
        message: "label_id is required"
      });
    }

    const label = await Label.findById(label_id);

    if (!label) {
      return res.status(404).json({
        success: 0,
        message: "Label not found"
      });
    }

    if (name) label.name = name;
    if (description) label.description = description;

    label.updatedBy = req.authUser?._id;
    label.updatedAt = new Date();

    const updated = await label.save();

    return res.status(200).json({
      success: 1,
      message: "Label updated successfully",
      data: updated
    });

  } catch (error) {
    return res.status(500).json({
      success: 0,
      message: error.message
    });
  }
};


// DELETE LABEL
const deleteLabel = async (req, res) => {
  try {
    const { label_id } = req.body;

    if (!label_id) {
      return res.status(400).json({
        success: 0,
        message: "label_id is required"
      });
    }

    const deleted = await Label.findByIdAndDelete(label_id);

    if (!deleted) {
      return res.status(404).json({
        success: 0,
        message: "Label not found"
      });
    }

    return res.status(200).json({
      success: 1,
      message: "Label deleted successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: 0,
      message: error.message
    });
  }
};

module.exports = {
  createLabel,
  getAllLabels,
  updateLabel,
  deleteLabel
};