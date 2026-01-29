import {
  ProviderProfile,
  UserRoles,
} from "../../../prisma/generated/prisma/browser";
import { prisma } from "../../lib/prisma";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../utils/AppError";
import { omitUndefined } from "../../utils/object";
import {
  ProviderProfileCreatePayload,
  ProviderProfileUpdatePayload,
} from "./provider-profile.types";

// POST | "/api/v1/provider-profiles/" | Create Provider Profile to become a provider
const createProviderProfile = async (payload: ProviderProfileCreatePayload) => {
  return await prisma.$transaction(async (tx) => {
    const result = await tx.providerProfile.create({
      data: {
        ...payload,
        description: payload.description ?? null,
        logo: payload.logo ?? null,
      },
    });

    await tx.user.update({
      where: {
        id: payload.userId,
      },
      data: {
        role: UserRoles.PROVIDER,
      },
    });

    return result;
  });
};

// GET "/api/v1/provider-profiles/:providerId" | Get provider profile by ID
const getProviderProfile = async (providerId: string) => {
  return await prisma.providerProfile.findUnique({
    where: {
      id: providerId,
    },
    include: {
      meals: true,
    },
  });
};

// GET "/api/v1/provider-profiles" | Get all provider profiles
const getProviderProfiles = async () => {
  return await prisma.providerProfile.findMany();
};

// PATCH | "/api/v1/provider-profiles/:providerId" | Update provider profile
const updateProviderProfile = async (
  providerId: string,
  payload: ProviderProfileUpdatePayload,
) => {
  // Check if Profile ID exists
  if (!providerId) {
    throw new BadRequestError("Profile Id not provided");
  }

  const profileToUpdate = await prisma.providerProfile.findUnique({
    where: {
      id: providerId,
    },
  });

  // Check if Provider Profile exists
  if (!profileToUpdate) {
    throw new NotFoundError("Profile not found");
  }

  // Check if the user trying to update the profile is the owner of the profile or not
  if (profileToUpdate.userId !== payload.userId) {
    throw new ForbiddenError(
      "You do not have permission to update this provider profile",
    );
  }

  const data = omitUndefined(payload);

  return await prisma.providerProfile.update({
    where: {
      id: providerId,
    },
    data,
  });
};

export const ProviderProfileService = {
  createProviderProfile,
  getProviderProfile,
  getProviderProfiles,
  updateProviderProfile,
};
