const { z } = require("zod");

const fieldBodySchema = z.object({
  slug: z.string().min(1).max(100),
  name: z.string().min(1).max(255),
  nameArabic: z.string().min(1).max(255),
  description: z.string().min(1).max(500),
  icon: z.string().min(1).max(100),
  order: z.number().int().min(0),
});

module.exports = { fieldBodySchema };
