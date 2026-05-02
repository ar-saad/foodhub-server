import { prisma } from "../../lib/prisma";
import { UserRoles, OrderStatus, PaymentStatus } from "../../../prisma/generated/prisma/enums";

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

// GET | "/api/v1/stats/admin" | Get admin dashboard statistics
const getAdminStats = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    userCounts,
    orderCount,
    categoryCount,
    mealCount,
    revenueData,
    statusCounts,
    totalRevenueResult
  ] = await Promise.all([
    prisma.user.groupBy({
      by: ['role'],
      _count: true
    }),
    prisma.order.count(),
    prisma.category.count(),
    prisma.meal.count(),
    prisma.order.findMany({
      where: {
        paymentStatus: PaymentStatus.PAID,
        createdAt: { gte: thirtyDaysAgo }
      },
      select: {
        createdAt: true,
        totalAmount: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    }),
    prisma.order.groupBy({
      by: ['status'],
      _count: true
    }),
    prisma.order.aggregate({
      where: { paymentStatus: PaymentStatus.PAID },
      _sum: { totalAmount: true }
    })
  ]);

  // Process users by role
  const usersByRole = userCounts.reduce((acc: any, curr) => {
    acc[curr.role] = curr._count;
    return acc;
  }, {});

  // Process order status distribution
  const orderStatusDistribution = statusCounts.map(curr => ({
    status: curr.status,
    count: curr._count
  }));

  // Process revenue over time (last 30 days)
  const revenueOverTime = processRevenueOverTime(revenueData, 30);

  return {
    counts: {
      users: usersByRole,
      totalUsers: userCounts.reduce((acc, curr) => acc + curr._count, 0),
      orders: orderCount,
      categories: categoryCount,
      meals: mealCount,
    },
    totalRevenue: totalRevenueResult._sum.totalAmount || 0,
    revenueOverTime,
    orderStatusDistribution
  };
};

// GET | "/api/v1/stats/provider" | Get provider dashboard statistics
const getProviderStats = async (providerId: string) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    mealCount,
    orderCount,
    revenueData,
    totalRevenueResult,
    topMealsData
  ] = await Promise.all([
    prisma.meal.count({ where: { providerId } }),
    prisma.order.count({ where: { providerId } }),
    prisma.order.findMany({
      where: {
        providerId,
        paymentStatus: PaymentStatus.PAID,
        createdAt: { gte: thirtyDaysAgo }
      },
      select: {
        createdAt: true,
        totalAmount: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    }),
    prisma.order.aggregate({
      where: { providerId, paymentStatus: PaymentStatus.PAID },
      _sum: { totalAmount: true }
    }),
    prisma.orderItem.groupBy({
      by: ['mealId'],
      where: {
        order: {
          providerId,
          paymentStatus: PaymentStatus.PAID
        }
      },
      _sum: {
        quantity: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: 5
    })
  ]);

  // Fetch meal names for top meals
  const topMealsWithNames = await Promise.all(
    topMealsData.map(async (item) => {
      const meal = await prisma.meal.findUnique({
        where: { id: item.mealId },
        select: { name: true }
      });
      return {
        name: meal?.name || 'Unknown',
        sales: item._sum.quantity || 0
      };
    })
  );

  const revenueOverTime = processRevenueOverTime(revenueData, 30);

  return {
    counts: {
      meals: mealCount,
      orders: orderCount,
    },
    totalRevenue: totalRevenueResult._sum.totalAmount || 0,
    revenueOverTime,
    topSellingMeals: topMealsWithNames
  };
};

// Helper to process revenue over time
const processRevenueOverTime = (data: any[], days: number) => {
  const revenueMap = new Map();
  
  // Initialize map with last N days
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    revenueMap.set(dateStr, 0);
  }

  // Fill with data
  data.forEach(item => {
    const dateStr = item.createdAt.toISOString().split('T')[0];
    if (revenueMap.has(dateStr)) {
      revenueMap.set(dateStr, revenueMap.get(dateStr) + Number(item.totalAmount));
    }
  });

  return Array.from(revenueMap.entries()).map(([date, revenue]) => ({
    date,
    revenue
  }));
};

export const StatsService = {
  getPlatformStats,
  getAdminStats,
  getProviderStats,
};
