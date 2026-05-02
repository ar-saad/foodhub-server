import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { StatsService } from "./stats.service";
import { sendResponse } from "../../utils/sendResponse";
import { prisma } from "../../lib/prisma";

// GET | "/api/v1/stats" | Get public platform statistics
const getPlatformStats = asyncHandler(async (_req: Request, res: Response) => {
  const result = await StatsService.getPlatformStats();

  sendResponse(
    {
      statusCode: 200,
      success: true,
      message: "Platform stats retrieved successfully",
      data: result,
    },
    res,
  );
});

// GET | "/api/v1/stats/admin" | Get admin dashboard statistics
const getAdminStats = asyncHandler(async (_req: Request, res: Response) => {
  const result = await StatsService.getAdminStats();

  sendResponse(
    {
      statusCode: 200,
      success: true,
      message: "Admin stats retrieved successfully",
      data: result,
    },
    res,
  );
});

// GET | "/api/v1/stats/provider" | Get provider dashboard statistics
const getProviderStats = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const providerProfile = await prisma.providerProfile.findUnique({
    where: { userId },
  });

  if (!providerProfile) {
    return sendResponse(
      {
        statusCode: 404,
        success: false,
        message: "Provider profile not found",
      },
      res,
    );
  }

  const result = await StatsService.getProviderStats(providerProfile.id);

  sendResponse(
    {
      statusCode: 200,
      success: true,
      message: "Provider stats retrieved successfully",
      data: result,
    },
    res,
  );
});

export const StatsController = {
  getPlatformStats,
  getAdminStats,
  getProviderStats,
};
