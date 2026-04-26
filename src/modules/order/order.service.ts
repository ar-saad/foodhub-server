import { OrderStatus, PaymentType, PaymentStatus } from "../../../prisma/generated/prisma/enums";
import { OrderWhereInput } from "../../../prisma/generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { CreateOrderPayload } from "./order.types";
import crypto from "crypto";

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
    // Hide unpaid online orders from providers so they don't prepare food before payment
    query.push({
      NOT: {
        AND: [
          { paymentType: PaymentType.ONLINE },
          { paymentStatus: PaymentStatus.UNPAID },
        ],
      },
    });
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
      payment: true,
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
      payment: true,
    },
  });
};

// POST | "/api/v1/orders" | Create order
const createOrder = async (payload: CreateOrderPayload) => {
  const { orderItems, ...orderData } = payload;

  const order = await prisma.order.create({
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
      orderItems: {
        include: {
          meal: true,
        }
      },
    },
  });

  if (payload.paymentType === PaymentType.ONLINE) {
    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: payload.totalAmount,
        transactionId: crypto.randomUUID(),
        status: PaymentStatus.UNPAID,
      }
    });

    const lineItems = order.orderItems.map(item => ({
      price_data: {
        currency: "bdt",
        product_data: {
          name: item.meal.name,
          images: item.meal.image ? [item.meal.image] : [],
        },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: item.quantity,
    }));

    const subtotal = order.orderItems.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
    const taxAndDelivery = payload.totalAmount - subtotal;
    
    if (taxAndDelivery > 0) {
      lineItems.push({
        price_data: {
          currency: "bdt",
          product_data: { name: "Tax & Delivery Charge", images: [] },
          unit_amount: Math.round(taxAndDelivery * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutes
      metadata: {
        orderId: order.id,
        paymentId: payment.id,
      },
      success_url: `${process.env.APP_URL}/payment/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL}/payment/payment-failed`,
    });

    // Persist checkout URL so the customer can retry payment from the dashboard
    await prisma.payment.update({
      where: { id: payment.id },
      data: { checkoutUrl: session.url },
    });

    return {
      order,
      paymentUrl: session.url,
    };
  }

  return { order };
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
