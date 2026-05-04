const Contact = require("../models/Contact");

exports.createContact = async (req, res) => {
  try {
    const { name, email, phone = "", subject = "General Inquiry", message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required"
      });
    }

    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message
    });

    res.status(201).json({
      success: true,
      message: "Contact message submitted successfully",
      data: contact
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAdminContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact message not found" });
    }

    res.status(200).json({ success: true, message: "Contact message deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
