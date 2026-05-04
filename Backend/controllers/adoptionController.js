const Adoption = require("../models/Adoption");

exports.createRequest = async (req, res) => {
  try {
    const body = req.body || {};

    const request = await Adoption.create({
      userId: req.user?._id || req.user?.id,
      dogId: body.dogId,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phoneNumber: body.phoneNumber || body.phone,
      homeAddress: body.homeAddress || body.address,
      city: body.city,
      zipCode: body.zipCode || body.zip,
      homeType: body.homeType,
      ownOrRent: body.ownOrRent || body.ownRent,
      adultsInHome: body.adultsInHome || body.adults,
      childrenInHome: body.childrenInHome || body.children,
      currentPets: body.currentPets || body.otherPets,
      dogExperience: body.dogExperience || body.experience,
      activityLevel: body.activityLevel,
      hoursDogWouldBeAlone: body.hoursDogWouldBeAlone || body.hoursAlone,
      whyDoYouWantToAdoptThisDog: body.whyDoYouWantToAdoptThisDog || body.reasonToAdopt || body.message,
      additionalNotes: body.additionalNotes || body.notes,
      message: body.whyDoYouWantToAdoptThisDog || body.reasonToAdopt || body.message,
      status: "pending"
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message || "Unable to submit adoption request" });
  }
};
