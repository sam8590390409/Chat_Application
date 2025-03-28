import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";

config(); // Load environment variables

// Debugging: Check if variables are loaded correctly
console.log("Cloudinary Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  // Correct variable name
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
