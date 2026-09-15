import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Enter your email").email("That email does not look right"),
});
