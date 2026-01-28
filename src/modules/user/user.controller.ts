import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { UserService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import { BadRequestError } from "../../utils/AppError";

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

export const UserController = {
  getCurrentlyLoggedInUser,
};
