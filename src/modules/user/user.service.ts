import {
  UserRoles,
  UserStatus,
} from "../../../prisma/generated/prisma/browser";
import { UserWhereInput } from "../../../prisma/generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { ForbiddenError } from "../../utils/AppError";
import { omitUndefined } from "../../utils/object";
import { UpdateUserPayload } from "./user.types";

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
const getUsers = async ({
  search,
  page,
  limit,
  skip,
  sortBy,
  sortOrder,
}: {
  search: string | undefined;
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}) => {
  const query: UserWhereInput[] = [];
  if (search) {
    query.push({
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          phone: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  const users = await prisma.user.findMany({
    take: limit,
    skip,
    where: {
      AND: query,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const count = await prisma.user.count({
    where: {
      AND: query,
    },
  });
  return {
    meta: {
      count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    },
    result: users,
  };
};

// GET | "/api/v1/users/:userId" | Get user by ID
const getUser = async (userId: string) => {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
};

// PATCH | "/api/v1/users/:userId" | Update user
const updateUser = async (
  userId: string,
  role: UserRoles,
  userIdParam: string,
  payload: UpdateUserPayload,
) => {
  // Admin can update anyone's information. User can only update their own information.
  if (role !== UserRoles.ADMIN && userId !== userIdParam) {
    throw new ForbiddenError("You do not have permission to update this user");
  }

  const data = omitUndefined(payload);

  return await prisma.user.update({
    where: {
      id: userIdParam,
    },
    data,
  });
};

// PATCH | "/api/v1/users/status/:userId" | Update user status
const updateUserStatus = async (userId: string, status: UserStatus) => {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status,
    },
  });
};

export const UserService = {
  getUsers,
  getUser,
  getCurrentlyLoggedInUser,
  updateUser,
  updateUserStatus,
};
