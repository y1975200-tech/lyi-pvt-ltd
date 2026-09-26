import express from "express";
import dotenv from "dotenv";
import { connectDB } from "../serverModels.ts";
import { apiRouter } from "../src/apiRoutes.ts";

dotenv.config();

const app = express();

// Ensure MongoDB Atlas connection in serverless environment
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://usb:usb123@cluster0.bujenyg.mongodb.net/LYIPVTLTD?retryWrites=true&w=majority";

// Lazy connection check middleware
app.use(async (_req, _res, next) => {
  try {
    await connectDB(MONGODB_URI);
  } catch (err) {
    console.error("Failed to connect to MongoDB Atlas in serverless function:", err);
  }
  next();
});

// Enable CORS for cross-origin client requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Route aliases to ensure frontend variations never 404
app.post("/api/booking", (req, res, next) => {
  req.url = "/api/bookings";
  app._router.handle(req, res, next);
});
app.post("/api/consultations", (req, res, next) => {
  req.url = "/api/bookings";
  app._router.handle(req, res, next);
});
app.post("/api/consultation", (req, res, next) => {
  req.url = "/api/bookings";
  app._router.handle(req, res, next);
});
app.post("/api/enquiry", (req, res, next) => {
  req.url = "/api/enquiries";
  app._router.handle(req, res, next);
});

// Mount main API router
app.use("/api", apiRouter);

// Fallback JSON for unknown API endpoints
app.all("/api/*", (req, res) => {
  res.status(404).json({ error: `API endpoint ${req.method} ${req.path} not found` });
});

export default app;
