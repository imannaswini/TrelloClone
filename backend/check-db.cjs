const mongoose = require("mongoose");
const UserModule = require("./models/User.js");
const User = UserModule.default;
require("dotenv").config();

async function checkDB() {
  await mongoose.connect(process.env.MONGO_URI);
  const users = await User.find().sort({ createdAt: -1 }).limit(2);
  console.log("Latest Users:");
  users.forEach(u => {
    console.log(`- ${u.email}: role=${u.role}, status=${u.status}`);
  });
  process.exit(0);
}

checkDB();
