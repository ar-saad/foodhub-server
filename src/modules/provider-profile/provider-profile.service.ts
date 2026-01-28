import {
  ProviderProfile,
  USER_ROLES,
} from "../../../prisma/generated/prisma/browser";
import { prisma } from "../../lib/prisma";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../utils/AppError";

// POST | "/" | Create Provider Profile to become a provider
const createProviderProfile = async (data: ProviderProfile) => {
  return await prisma.$transaction(async (tx) => {
    const result = await prisma.providerProfile.create({
      data,
    });

    await prisma.user.update({
      where: {
        id: data.userId,
      },
      data: {
        role: USER_ROLES.PROVIDER,
      },
    });

    return result;
  });
};

// PATCH | "/:providerId" | Update provider profile
const updateProviderProfile = async (
  providerId: string,
  data: Partial<ProviderProfile>,
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
  if (profileToUpdate.userId !== data.userId) {
    throw new ForbiddenError(
      "You do not have permission to update this provider profile",
    );
  }

  return await prisma.providerProfile.update({
    where: {
      id: providerId,
    },
    data,
  });
};

export const ProviderProfileService = {
  createProviderProfile,
  updateProviderProfile,
};
