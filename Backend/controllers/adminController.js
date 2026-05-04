const Adoption = require("../models/Adoption");
const Dog = require("../models/Dog");
const User = require("../models/User");

/**
 * Get all adoption applications (Admin Only)
 */
exports.getAllAdoptions = async (req, res) => {
  try {
    const adoptions = await Adoption.find()
      .populate("userId", "name email")
      .populate("dogId", "name image imageUrl breed")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: adoptions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update adoption status
 */
exports.updateAdoptionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const adoption = await Adoption.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!adoption) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    res.status(200).json({ success: true, message: `Application ${status}`, data: adoption });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Delete rejected adoption application
 */
exports.deleteAdoption = async (req, res) => {
  try {
    const adoption = await Adoption.findById(req.params.id);

    if (!adoption) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    if ((adoption.status || "").toLowerCase() !== "rejected") {
      return res.status(400).json({ success: false, message: "Only rejected applications can be deleted" });
    }

    await adoption.deleteOne();

    res.status(200).json({ success: true, message: "Application deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get simple stats for dashboard
 */
exports.getStats = async (req, res) => {
  try {
    const dogCount = await Dog.countDocuments();
    const userCount = await User.countDocuments();
    const adoptionCount = await Adoption.countDocuments();
    const pendingAdoptions = await Adoption.countDocuments({ status: "pending" });

    res.status(200).json({
      success: true,
      data: {
        dogs: dogCount,
        users: userCount,
        adoptions: adoptionCount,
        pending: pendingAdoptions
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get all users (Admin Only)
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
