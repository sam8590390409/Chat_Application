import express from "express";
import { connectionDB } from "./lib/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./routes/auth.route.js";
import MessageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config(); // Load environment variables at the top

app.use(express.json({ limit: "50mb" })); // Increase request size limit
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRouter);
app.use("/api/messages", MessageRoutes);

const PORT = process.env.PORT || 5000; // Add default fallback port

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectionDB();
});
