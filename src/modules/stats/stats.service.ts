import { prisma } from "../../lib/prisma";
import { UserRoles } from "../../../prisma/generated/prisma/enums";

// GET | "/api/v1/stats" | Get public platform statistics
const getPlatformStats = async () => {
  const [restaurantCount, customerCount, orderCount] = await Promise.all([
    prisma.providerProfile.count(),
    prisma.user.count({ where: { role: UserRoles.CUSTOMER } }),
    prisma.order.count(),
  ]);

  return {
    restaurantCount,
    customerCount,
    orderCount,
  };
};

export const StatsService = {
  getPlatformStats,
};
