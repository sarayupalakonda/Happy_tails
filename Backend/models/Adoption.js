const mongoose = require("mongoose");

const adoptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  dogId: { type: mongoose.Schema.Types.ObjectId, ref: "Dog" },
  firstName: String,
  lastName: String,
  email: String,
  phoneNumber: String,
  homeAddress: String,
  city: String,
  zipCode: String,
  homeType: String,
  ownOrRent: String,
  adultsInHome: String,
  childrenInHome: String,
  currentPets: String,
  dogExperience: String,
  activityLevel: String,
  hoursDogWouldBeAlone: String,
  whyDoYouWantToAdoptThisDog: String,
  additionalNotes: String,
  message: String,
  status: { type: String, default: "pending" },
}, { strict: false, timestamps: true });

module.exports = mongoose.model("Adoption", adoptionSchema);
