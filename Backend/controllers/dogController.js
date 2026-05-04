const Dog = require("../models/Dog");

exports.getDogs = async (req, res) => {
  const dogs = await Dog.find();
  res.json(dogs);
};

exports.getDog = async (req, res) => {
  const dog = await Dog.findById(req.params.id);
  res.json(dog);
};

exports.addDog = async (req, res) => {
  const dog = await Dog.create(req.body);
  res.json(dog);
};

exports.updateDog = async (req, res) => {
  const dog = await Dog.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(dog);
};

exports.deleteDog = async (req, res) => {
  await Dog.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};