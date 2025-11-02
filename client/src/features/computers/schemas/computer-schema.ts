import { z } from "zod";

const computerStatusSchema = z.union([
    z.literal("ONLINE"),
    z.literal("OFFLINE"),
    z.literal("UNKNOWN"),
]);

const agentSchema = z.object({
    idAgent: z.string(),
    idComputer: z.string(),
    status: computerStatusSchema,
    version: z.string().optional(),
    lastSeen: z.string().optional(),
    createdAt: z.string().optional(),
});

export const computerSchema = z.object({
    idComputer: z.string(),
    hostname: z.string(),
    ipAddress: z.string(),
    os: z.string(),
    status: computerStatusSchema.optional(),
    lastSeen: z.string().optional(),
    agents: z.array(agentSchema).optional(),
});

export type Computer = z.infer<typeof computerSchema>;
export type ComputerStatus = z.infer<typeof computerStatusSchema>;
export type Agent = z.infer<typeof agentSchema>;

export const computerListSchema = z.array(computerSchema);

