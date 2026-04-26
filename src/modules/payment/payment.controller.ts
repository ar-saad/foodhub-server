import { Request, Response } from "express";
import { PaymentService } from "./payment.service";
import { stripe } from "../../lib/stripe";

const handleStripeWebhookEvent = async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    console.error("Missing Stripe signature or webhook secret");
    return res.status(400).json({ message: "Missing Stripe signature or webhook secret" });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (error: any) {
    console.error("Error processing Stripe webhook:", error.message);
    return res.status(400).json({ message: "Error processing Stripe webhook" });
  }

  try {
    const result = await PaymentService.handleStripeWebhookEvent(event);
    res.status(200).json({
      success: true,
      message: "Stripe webhook event processed successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error handling Stripe webhook event:", error);
    res.status(500).json({
      success: false,
      message: "Error handling Stripe webhook event",
    });
  }
};

export const PaymentController = {
  handleStripeWebhookEvent,
};
