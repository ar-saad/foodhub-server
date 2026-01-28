import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ProviderProfileService } from "./provider-profile.service";
import { sendResponse } from "../../utils/sendResponse";
import { BadRequestError } from "../../utils/AppError";

// POST | "/" | Create Provider Profile to become a provider
const createProviderProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user;

    const data = req.body;
    data.userId = user?.id;

    const result = await ProviderProfileService.createProviderProfile(data);

    sendResponse(
      {
        statusCode: 201,
        success: true,
        message: "Provider Profile created successfully",
        data: result,
      },
      res,
    );
  },
);

// PATCH | "/:providerId" | Update provider profile
const updateProviderProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const { providerId } = req.params;

    if (!providerId || typeof providerId !== "string") {
      throw new BadRequestError(
        "Provider ID not provided or the format is invalid",
      );
    }

    const user = req.user;
    const data = req.body;
    data.userId = user?.id;

    const result = await ProviderProfileService.updateProviderProfile(
      providerId,
      data,
    );

    sendResponse(
      {
        statusCode: 200,
        success: true,
        message: "Provider Profile updated successfully",
        data: result,
      },
      res,
    );
  },
);

export const ProviderProfileController = {
  createProviderProfile,
  updateProviderProfile,
};
