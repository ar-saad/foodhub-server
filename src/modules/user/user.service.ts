import { prisma } from "../../lib/prisma";

const getCurrentlyLoggedInUser = async (userId: string) => {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
};

export const UserService = {
  getCurrentlyLoggedInUser,
};
