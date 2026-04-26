import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { PaymentStatus } from "../../../prisma/generated/prisma/enums";
import { generateInvoicePdf } from "./payment.utils";
import { uploadPdfToCloudinary } from "../../lib/cloudinary";
import { transporter } from "../../utils/sendEmail";

export const handleStripeWebhookEvent = async (event: Stripe.Event) => {
  const existingPayment = await prisma.payment.findFirst({
    where: { stripeEventId: event.id },
  });

  if (existingPayment) {
    console.log(`Event ${event.id} already processed. Skipping`);
    return { message: `Event ${event.id} already processed.` };
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    const orderId = session.metadata?.orderId;
    const paymentId = session.metadata?.paymentId;

    if (!orderId || !paymentId) {
      console.error("Missing metadata in webhook event");
      return { message: "Missing metadata" };
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true,
        providerProfile: true,
        orderItems: {
          include: { meal: true },
        },
      },
    });

    if (!order) {
      console.error(`Order ${orderId} not found.`);
      return { message: "Order not found" };
    }

    let pdfBuffer: Buffer | null = null;
    const isPaid = session.payment_status === "paid";

    const result = await prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: isPaid ? PaymentStatus.PAID : PaymentStatus.UNPAID,
        },
      });

      if (isPaid) {
        try {
          const subtotal = order.orderItems.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
          const taxAndDelivery = Number(order.totalAmount) - subtotal;
          
          pdfBuffer = await generateInvoicePdf({
            invoiceId: paymentId,
            customerName: order.customer.name,
            customerEmail: order.customer.email,
            providerName: order.providerProfile.name,
            orderDate: order.createdAt.toISOString(),
            amount: Number(order.totalAmount),
            transactionId: session.payment_intent as string || paymentId,
            items: order.orderItems.map(i => ({
              name: i.meal.name,
              quantity: i.quantity,
              price: Number(i.price)
            })),
            subtotal,
            taxAndDelivery
          });
        } catch (error) {
          console.error("Error generating invoice PDF", error);
        }
      }

      const updatedPayment = await tx.payment.update({
        where: { id: paymentId },
        data: {
          status: isPaid ? PaymentStatus.PAID : PaymentStatus.UNPAID,
          stripeEventId: event.id,
          paymentGatewayData: session as any,
        },
      });

      return { updatedOrder, updatedPayment };
    });

    if (isPaid && pdfBuffer) {
      try {
        // Upload PDF to Cloudinary
        const invoiceUrl = await uploadPdfToCloudinary(
          pdfBuffer,
          `invoice-${paymentId}`
        );

        // Save invoice URL to the payment record
        await prisma.payment.update({
          where: { id: paymentId },
          data: { invoiceUrl },
        });

        // Send email with PDF attachment and Cloudinary link
        await transporter.sendMail({
          from: '"FoodHub" <arsaad.dev@gmail.com>',
          to: order.customer.email,
          subject: "Your FoodHub Order Receipt",
          text: `Hi ${order.customer.name},\n\nYour payment for order ${order.id} was successful. Please find your detailed receipt attached.\n\nYou can also download your invoice anytime here:\n${invoiceUrl}\n\nThank you for choosing FoodHub!`,
          attachments: [
            {
              filename: `Invoice-${paymentId}.pdf`,
              content: pdfBuffer,
              contentType: "application/pdf",
            },
          ],
        });
        console.log(`Invoice uploaded & email sent to ${order.customer.email}`);
      } catch (error) {
        console.error("Error uploading invoice or sending email", error);
      }
    }

    console.log(`Payment ${session.payment_status} for order ${orderId}`);
  } else if (event.type === "checkout.session.expired") {
    // Stripe fires this when a checkout session expires (after 30 min)
    // We delete the unpaid order so it doesn't clutter the database
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (!orderId) {
      console.error("Missing orderId in expired session metadata");
      return { message: "Missing metadata" };
    }

    try {
      await prisma.order.delete({
        where: { id: orderId },
      });
      console.log(`Order ${orderId} deleted — checkout session expired`);
    } catch (error) {
      console.error(`Failed to delete expired order ${orderId}:`, error);
    }
  }

  return { message: "Webhook processed" };
};

export const PaymentService = {
  handleStripeWebhookEvent,
};
