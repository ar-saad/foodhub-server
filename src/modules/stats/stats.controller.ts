import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { StatsService } from "./stats.service";
import { sendResponse } from "../../utils/sendResponse";

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

export const StatsController = {
  getPlatformStats,
};
