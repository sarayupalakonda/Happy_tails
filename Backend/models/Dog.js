const mongoose = require("mongoose");

const dogSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  size: String,
  breed: String,
  location: String,
  description: String,
  image: String,
  imagePosition: {
    type: String,
    default: "center"
  },
  personalityTags: [String],
  videoUrl: String,
  adoptionFee: Number,
  vaccinationStatus: {
    type: String,
    enum: ["Vaccinated", "Not Vaccinated", "Partially Vaccinated"],
    default: "Vaccinated"
  },
  urgencyLabel: String,
  availabilityStatus: {
    type: String,
    enum: ["Available", "Pending", "Adopted"],
    default: "Available"
  },
  type: {
    type: String,
    enum: ["pet", "street", "rescue"],
    default: "pet"
  },
  rescueLocation: String,
  healthStatus: String,
  rescueStory: String
});

module.exports = mongoose.model("Dog", dogSchema);
