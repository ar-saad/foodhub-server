import { Response } from "express";

export const sendResponse = <T>(
  resData: {
    statusCode: number;
    success: boolean;
    message: string;
    data?: T;
  },
  res: Response
) => {
  return res.status(resData?.statusCode).json({
    success: resData.success,
    message: resData?.message || "Request successful",
    data: resData.data || null,
  });
};
