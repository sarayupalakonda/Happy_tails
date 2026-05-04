const User = require("../models/User");
const bcrypt = require("bcryptjs");

const createAdmin = async () => {
  try {
    const adminEmail = "admin@happytails.com";
    const adminUser = await User.findOne({ email: adminEmail });

    if (!adminUser) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      
      await User.create({
        name: "Admin Hub",
        email: adminEmail,
        password: hashedPassword,
        role: "admin"
      });

      console.log("✅ Default Admin created: admin@happytails.com / admin123");
    } else if (adminUser.role !== 'admin') {
      // Ensure existing admin user has the admin role
      adminUser.role = 'admin';
      await adminUser.save();
      console.log("🛠️ Existing admin user role updated to 'admin'");
    } else {
      console.log("ℹ️ Admin user already exists with correct role. Skipping.");
    }
  } catch (error) {
    console.error("❌ Error initializing admin:", error.message);
  }
};

module.exports = createAdmin;
