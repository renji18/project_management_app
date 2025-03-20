import { object, string, z } from "zod";

export const signInSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const signUpSchema = object({
  name: string({ required_error: "Name is required" }).min(
    2,
    "Name must be at least 2 characters long",
  ),
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const createTaskSchema = object({
  title: string().min(1, "Title is required"),
  description: string().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  deadline: string().nullable().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = object({
  title: string().min(1, "Title is required").optional(),
  description: string().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  status: z.enum(["pending", "in-progress", "completed"]).optional(),
  deadline: string().nullable().optional(),
});

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
