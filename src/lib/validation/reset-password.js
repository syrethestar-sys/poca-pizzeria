import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Passwords are at least 6 characters"),
    confirm: z.string().min(6, "Repeat your password"),
  })
  .refine((values) => values.password === values.confirm, {
    path: ["confirm"],
    message: "The two passwords do not match",
  });
