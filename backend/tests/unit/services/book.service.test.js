jest.mock("../../../src/repositories/book.repository");

const bookRepo = require("../../../src/repositories/book.repository");
const bookService = require("../../../src/services/book.service");
const AppError = require("../../../src/errors/AppError");

const validData = { title: "Fath al-Bari", author: "Ibn Hajar", type: "sharh" };

describe("book.service", () => {
  describe("getAll", () => {
    it("delegates to the repository", async () => {
      const books = [validData];
      bookRepo.findAll.mockResolvedValue(books);
      const result = await bookService.getAll();
      expect(result).toBe(books);
    });
  });

  describe("create", () => {
    it("throws AppError 400 when a book with the same title already exists", async () => {
      bookRepo.findByTitle.mockResolvedValue({ title: "Fath al-Bari" });
      await expect(bookService.create(validData))
        .rejects.toMatchObject({ statusCode: 400, message: "Book already exists" });
    });

    it("creates and returns the new book", async () => {
      bookRepo.findByTitle.mockResolvedValue(null);
      const created = { _id: "abc", ...validData };
      bookRepo.create.mockResolvedValue(created);

      const result = await bookService.create(validData);

      expect(bookRepo.create).toHaveBeenCalledWith(validData);
      expect(result).toBe(created);
    });
  });

  describe("update", () => {
    it("throws AppError 404 when book does not exist", async () => {
      bookRepo.update.mockResolvedValue(null);
      await expect(bookService.update("id1", validData))
        .rejects.toMatchObject({ statusCode: 404, message: "Book not found" });
    });

    it("returns the updated book on success", async () => {
      const updated = { _id: "id1", ...validData, author: "New Author" };
      bookRepo.update.mockResolvedValue(updated);
      const result = await bookService.update("id1", validData);
      expect(result).toBe(updated);
    });
  });

  describe("remove", () => {
    it("throws AppError 404 when book does not exist", async () => {
      bookRepo.remove.mockResolvedValue(null);
      await expect(bookService.remove("id1"))
        .rejects.toMatchObject({ statusCode: 404, message: "Book not found" });
    });

    it("resolves without returning a value on success", async () => {
      bookRepo.remove.mockResolvedValue({ _id: "id1" });
      await expect(bookService.remove("id1")).resolves.toBeUndefined();
    });
  });
});
