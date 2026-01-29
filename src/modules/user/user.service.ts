import { User, USER_ROLES } from "../../../prisma/generated/prisma/browser";
import { prisma } from "../../lib/prisma";
import { ForbiddenError } from "../../utils/AppError";

type UpdateUserPayload = {
  name?: string;
  image?: string;
  phone?: string;
};

// GET | "/api/v1/users/me" | Get currently logged in user data
const getCurrentlyLoggedInUser = async (userId: string) => {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      providerProfile: true,
    },
  });
};

// GET | "/api/v1/users" | Get all users
const getUsers = async () => {
  return await prisma.user.findMany();
};

// PATCH | "/api/v1/users/:userId" | Update user
const updateUser = async (
  userId: string,
  role: USER_ROLES,
  userIdParam: string,
  payload: UpdateUserPayload,
) => {
  // Admin can update anyone's information. User can only update their own information.
  if (role !== USER_ROLES.ADMIN && userId !== userIdParam) {
    throw new ForbiddenError("You do not have permission to update this user");
  }

  return await prisma.user.update({
    where: {
      id: userIdParam,
    },
    data: payload,
  });
};

export const UserService = {
  getUsers,
  getCurrentlyLoggedInUser,
  updateUser,
};
