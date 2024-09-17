import { z } from "zod";

export const registrationSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters long")
      .max(50, "Name must not exceed 50 characters"),

    email: z
      .string()
      .email("Invalid email address")
      .min(5, "Email must be at least 5 characters long")
      .max(100, "Email must not exceed 100 characters"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(100, "Password must not exceed 100 characters"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
