import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("DB Error:", error.message);
    console.warn("⚠️ Server will remain running, but database operations will fail until connection is restored.");
  }
};

export default connectDB;
