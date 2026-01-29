import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { UserService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import { BadRequestError } from "../../utils/AppError";
import { UserRoles } from "../../../prisma/generated/prisma/enums";
import { omitUndefined } from "../../utils/object";

// GET | "/api/v1/users/me" | Get currently logged in user data
const getCurrentlyLoggedInUser = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      throw new BadRequestError("User ID not provided");
    }

    const result = await UserService.getCurrentlyLoggedInUser(userId);

    sendResponse(
      {
        statusCode: 200,
        success: true,
        message: "User data retrieved successfully",
        data: result,
      },
      res,
    );
  },
);

// GET | "/api/v1/users" | Get all users
const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const result = await UserService.getUsers();

  sendResponse(
    {
      statusCode: 200,
      success: true,
      message: "Retrieved all users data",
      data: result,
    },
    res,
  );
});

// PATCH | "/api/v1/users/:userId" | Update user
const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId: userIdParam } = req.params;
  const user = req.user;
  const data = req.body;

  const payload = omitUndefined({
    name: data.name,
    image: data.image,
    phone: data.phone,
  });

  if (!user) {
    throw new BadRequestError("Invalid request");
  }

  if (!userIdParam || typeof userIdParam !== "string") {
    throw new BadRequestError("Invalid request");
  }

  const result = await UserService.updateUser(
    user.id,
    user.role as UserRoles,
    userIdParam,
    payload,
  );

  sendResponse(
    {
      statusCode: 200,
      success: true,
      message: "User updated successfully",
      data: result,
    },
    res,
  );
});

export const UserController = {
  getUsers,
  getCurrentlyLoggedInUser,
  updateUser,
};
