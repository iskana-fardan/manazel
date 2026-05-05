const { z } = require("zod");

const contributorBodySchema = z.object({
  name: z.string().min(3).max(50),
  role: z.string().min(3).max(100),
  description: z.string().max(500),
  avatar: z.string().url().optional(),
  socials: z
    .object({
      github: z.string().url().optional(),
      instagram: z.string().optional(),
      website: z.string().url().optional(),
    })
    .optional(),
});

module.exports = { contributorBodySchema };
