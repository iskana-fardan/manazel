const { z } = require("zod");

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");

const addBookSchema = z.object({
  bookId: objectId,
});

module.exports = { addBookSchema };
