import mongoose from "mongoose";

export const connectionDB = async () => {
    try {
      const connect = await mongoose.connect(process.env.MONGODB_URL);
      console.log(`MongoDB Connected: ${connect.connection.host}`);
    } catch (error) {
      console.error("MongoDB Connection Error:", error.message);
      process.exit(1); // Stop the server if DB connection fails
    }
  };
  
  