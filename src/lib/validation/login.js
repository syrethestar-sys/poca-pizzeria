import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Enter your email").email("That email does not look right"),
  password: z.string().min(6, "Passwords are at least 6 characters"),
});
