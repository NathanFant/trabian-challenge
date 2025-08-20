import { z } from "zod";

export const TxQuerySchema = z.object({
  accountId: z.string().optional(),
  from: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  to: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  category: z.string().optional(),
  limit: z.coerce.number().int().positive().max(500).optional(),
});

export type TxQuery = z.infer<typeof TxQuerySchema>;
