const Dog = require("../models/Dog");

const indianLocationMap = {
  "New York, NY": "Hyderabad, Telangana",
  "Chicago, IL": "Madhapur, Hyderabad",
  "Austin, TX": "Bengaluru, Karnataka",
  "Denver, CO": "Chennai, Tamil Nadu",
  "Miami, FL": "Mumbai, Maharashtra",
  "Seattle, WA": "Pune, Maharashtra",
  "Boston, MA": "Delhi, India",
  "Phoenix, AZ": "Jaipur, Rajasthan",
  "Los Angeles, CA": "Kochi, Kerala",
  "Bangalore, IN": "Bengaluru, Karnataka",
  "Hyderabad, IN": "Hyderabad, Telangana",
  "Chennai, IN": "Chennai, Tamil Nadu",
  "Delhi, IN": "Delhi, India",
  "Mumbai, IN": "Mumbai, Maharashtra",
  "Pune, IN": "Pune, Maharashtra",
  "Kolkata, IN": "Kolkata, West Bengal"
};

function normalizeLocationFields(dog) {
  if (!dog) return dog;
  const data = typeof dog.toObject === "function" ? dog.toObject() : dog;
  if (data.location && indianLocationMap[data.location]) {
    data.location = indianLocationMap[data.location];
  }
  return data;
}

exports.getDogs = async (req, res) => {
  const dogs = await Dog.find();
  res.json(dogs.map(normalizeLocationFields));
};

exports.getDog = async (req, res) => {
  const dog = await Dog.findById(req.params.id);
  res.json(normalizeLocationFields(dog));
};

exports.addDog = async (req, res) => {
  const payload = normalizeLocationFields({ ...req.body });
  const dog = await Dog.create(payload);
  res.json(dog);
};

exports.updateDog = async (req, res) => {
  const payload = normalizeLocationFields({ ...req.body });
  const dog = await Dog.findByIdAndUpdate(req.params.id, payload, { new: true });
  res.json(dog);
};

exports.deleteDog = async (req, res) => {
  await Dog.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
