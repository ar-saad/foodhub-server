import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ProviderProfileService } from "./provider-profile.service";
import { sendResponse } from "../../utils/sendResponse";
import { BadRequestError } from "../../utils/AppError";
import { omitUndefined } from "../../utils/object";
import { updateProviderProfileSchema } from "./provider-profile.schema";

// POST | "/" | Create Provider Profile to become a provider
const createProviderProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user;

    const data = req.body;

    const payload = omitUndefined({
      userId: user?.id,
      name: data.name,
      address: data.address,
      description: data.description,
      logo: data.logo,
    });

    const result = await ProviderProfileService.createProviderProfile(payload);

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

// GET "/api/v1/provider-profiles/:providerId" | Get provider profile by ID
const getProviderProfile = asyncHandler(async (req: Request, res: Response) => {
  const { providerId } = req.params;

  if (!providerId) {
    throw new BadRequestError("Invalid request");
  }

  const result = await ProviderProfileService.getProviderProfile(
    providerId as string,
  );

  sendResponse(
    {
      statusCode: 200,
      success: true,
      message: "Provider profile retrieved successfully",
      data: result,
    },
    res,
  );
});

// GET "/api/v1/provider-profiles" | Get all provider profiles
const getProviderProfiles = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await ProviderProfileService.getProviderProfiles();
    sendResponse(
      {
        statusCode: 200,
        success: true,
        message: "Provider profiles retrieved successfully",
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
    const data = req.body;
    const user = req.user;

    if (!providerId || typeof providerId !== "string") {
      throw new BadRequestError(
        "Provider ID not provided or the format is invalid",
      );
    }

    data.userId = user?.id;

    const payload = updateProviderProfileSchema.parse(data);

    const result = await ProviderProfileService.updateProviderProfile(
      providerId,
      payload,
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
  getProviderProfile,
  getProviderProfiles,
  updateProviderProfile,
};
