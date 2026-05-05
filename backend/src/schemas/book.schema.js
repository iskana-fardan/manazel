const { z } = require("zod");

const resourceSchema = z.object({
  label: z.string().min(3).max(255),
  type: z.string().min(3).max(100),
  url: z.string().url(),
});

const editionSchema = z.object({
  publisher: z.string().min(3).max(255).optional(),
  note: z.string().min(3).max(255).optional(),
  label: z.string().min(3).max(255),
});

const bookBodySchema = z.object({
  title: z.string().min(3).max(255),
  titleArabic: z.string().min(3).max(255).optional(),
  author: z.string().min(3).max(255),
  type: z.string().optional(),
  level: z.string().optional(),
  field: z.string().optional(),
  description: z.string().max(500).optional(),
  recommendedUsage: z.string().max(500).optional(),
  resources: z.array(resourceSchema).optional(),
  recommendedEditions: z.array(editionSchema).optional(),
});

module.exports = { bookBodySchema };
