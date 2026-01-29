import * as z from "zod";
import {
  createProviderProfileSchema,
  updateProviderProfileSchema,
} from "./provider-profile.schema";

export type ProviderProfileCreatePayload = z.infer<
  typeof createProviderProfileSchema
>;

export type ProviderProfileUpdatePayload = z.infer<
  typeof updateProviderProfileSchema
>;
