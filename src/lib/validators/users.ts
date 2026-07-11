import { z } from "zod";

export const userRoleSchema = z.enum(["admin", "operator"]);
export const createUserSchema = z.object({ name: z.string().trim().min(3, "Nama minimal 3 karakter.").max(100), email: z.string().trim().email("Email tidak valid."), password: z.string().min(8, "Password minimal 8 karakter."), role: userRoleSchema, phone: z.string().trim().max(30).optional().or(z.literal("")) });
export const updateUserSchema = z.object({ name: z.string().trim().min(3, "Nama minimal 3 karakter.").max(100).optional(), email: z.string().trim().email("Email tidak valid.").optional(), password: z.string().min(8, "Password minimal 8 karakter.").optional().or(z.literal("")), role: userRoleSchema.optional(), phone: z.string().trim().max(30).optional(), avatar_url: z.string().url().optional().or(z.literal("")), is_active: z.boolean().optional() });
export const profileSchema = updateUserSchema.pick({ name: true, email: true, password: true, phone: true, avatar_url: true });
