import { z } from "zod";

const userStatusSchemas = z.union([z.literal("active"), z.literal("inactive")]);

const userRoleSchema = z.union([z.literal("admin"), z.literal("user")]);

const userSchema = z.object({
    registrationNumber: z.number(),
    username: z.string(),
    email: z.string(),
    role: userRoleSchema,
});

export type User = z.infer<typeof userSchema>;

export const userListSchema = z.array(userSchema);