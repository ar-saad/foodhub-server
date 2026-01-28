import express, { Application, Request, Response } from "express";
import cors from "cors";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";

const app: Application = express();

// CORS config
app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:5000",
    credentials: true,
  }),
);

// Parser
app.use(express.json());

// Routes
app.all("/api/auth/*splat", toNodeHandler(auth)); // Auth route

// ROOT DIRECTORY
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to FoodHub server! Discover & Order Delicious Meals");
});

export default app;
