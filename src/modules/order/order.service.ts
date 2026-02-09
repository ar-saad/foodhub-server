import { OrderStatus } from "../../../prisma/generated/prisma/enums";
import { OrderWhereInput } from "../../../prisma/generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { CreateOrderPayload } from "./order.types";

// GET | "/api/v1/orders" | Get all orders
const getOrders = async (payload: {
  customerId: string | undefined;
  providerId: string | undefined;
  status: OrderStatus | undefined;
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}) => {
  const {
    customerId,
    providerId,
    status,
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  } = payload;

  const query: OrderWhereInput[] = [];

  if (customerId) {
    query.push({ customerId });
  }

  if (providerId) {
    query.push({ providerId });
  }

  if (status) {
    query.push({ status });
  }

  const orders = await prisma.order.findMany({
    take: limit,
    skip,
    where: {
      AND: query,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      orderItems: {
        include: {
          meal: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      },
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      providerProfile: {
        select: {
          id: true,
          name: true,
          logo: true,
        },
      },
    },
  });

  const count = await prisma.order.count({
    where: {
      AND: query,
    },
  });

  return {
    metadata: {
      count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    },
    orders,
  };
};

// GET | "/api/v1/orders/:orderId" | Get order by ID
const getOrder = async (orderId: string) => {
  return await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      orderItems: {
        include: {
          meal: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      },
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      providerProfile: {
        select: {
          id: true,
          name: true,
          logo: true,
        },
      },
      reviews: true,
    },
  });
};

// POST | "/api/v1/orders" | Create order
const createOrder = async (payload: CreateOrderPayload) => {
  const { orderItems, ...orderData } = payload;

  return await prisma.order.create({
    data: {
      ...orderData,
      orderItems: {
        create: orderItems.map((item) => ({
          mealId: item.mealId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
    include: {
      orderItems: true,
    },
  });
};

// PATCH | "/api/v1/orders/:orderId" | Update order status
const updateOrder = async (orderId: string, status: OrderStatus) => {
  return await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status,
    },
  });
};

export const OrderService = {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
};
