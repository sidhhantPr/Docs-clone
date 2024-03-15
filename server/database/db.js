import mongoose from "mongoose";

async function connectDB() {
  try {
    await mongoose.connect("mongodb://localhost:27017/google-docs");
    console.log("MongoDB connected ");
  } catch (error) {
    console.log("error in the connecting db");
  }
}

export default connectDB;
