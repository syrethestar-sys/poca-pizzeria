import { z } from "zod";

export const checkoutSchema = z
  .object({
    type: z.enum(["delivery", "pickup"]),
    name: z.string().min(1, "Enter a name for the order"),
    phone: z.string().min(6, "Enter a phone number we can call"),
    phone2: z.string().optional(),
    address: z.string().optional(),
    addressType: z.enum(["home", "office"]).default("home"),
    entrance: z.string().optional(),
    floor: z.string().optional(),
    apartment: z.string().optional(),
    addressNote: z.string().optional(),
    note: z.string().optional(),
  })
  .refine((values) => values.type !== "delivery" || (values.address ?? "").trim().length > 0, {
    path: ["address"],
    message: "Delivery needs an address — pick one from the map in the header",
  });
