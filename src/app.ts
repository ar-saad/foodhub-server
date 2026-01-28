import express, { Application, Request, Response } from "express";
import cors from "cors";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";
import { requestLogger } from "./middlewares/requestLogger";
import { notFound } from "./middlewares/notFound";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { ProviderProfileRouter } from "./modules/provider-profile/provider-profile.router";
import { UserRouter } from "./modules/user/user.router";

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
// Logger
app.use(requestLogger);

// Routes
app.all("/api/auth/*splat", toNodeHandler(auth)); // Auth route
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/provider-profiles", ProviderProfileRouter);

// ROOT DIRECTORY
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to FoodHub server! Discover & Order Delicious Meals");
});

// API Route not found
app.use(notFound);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
