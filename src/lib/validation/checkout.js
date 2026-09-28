import { z } from "zod";
import { normalizeMnPhone } from "@/lib/phone";

const PHONE_MESSAGE = "Enter an 8-digit Mongolian number · 8 оронтой утасны дугаар оруулна уу";

export const checkoutSchema = z
  .object({
    type: z.enum(["delivery", "pickup"]),
    name: z.string().trim().min(1, "Enter a name for the order · Нэрээ оруулна уу"),
    phone: z.string().refine((v) => normalizeMnPhone(v) !== null, PHONE_MESSAGE),
    phone2: z
      .string()
      .optional()
      .refine((v) => !v || normalizeMnPhone(v) !== null, PHONE_MESSAGE),
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
    message: "Choose the delivery address · Хүргэлтийн хаягаа сонгоно уу",
  });
