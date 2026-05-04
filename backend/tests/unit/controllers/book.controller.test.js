jest.mock("mongoose", () => {
  const isValid = jest.fn();
  return {
    default: { Types: { ObjectId: { isValid } } },
    Types: { ObjectId: { isValid } },
  };
});

jest.mock("../../../src/models/book.model", () => {
  const MockBook = jest.fn(() => ({ save: jest.fn() }));
  MockBook.find = jest.fn();
  MockBook.findOne = jest.fn();
  MockBook.findByIdAndDelete = jest.fn();
  MockBook.findByIdAndUpdate = jest.fn();
  return { Book: MockBook, validate: jest.fn() };
});

const mongoose = require("mongoose");
const { Book, validate } = require("../../../src/models/book.model");
const { getBooks, createBook, deleteBook, updateBook } = require("../../../src/controllers/book.controller");

const mockIsValid = mongoose.default.Types.ObjectId.isValid;
const VALID_ID = "507f1f77bcf86cd799439011";

describe("book.controller", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };
  });

  // ── getBooks ─────────────────────────────────────────────────────────────

  describe("getBooks", () => {
    it("returns 200 with an empty array when no books exist", async () => {
      Book.find.mockResolvedValue([]);
      await getBooks(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith([]);
    });

    it("returns 200 with the list of books", async () => {
      const books = [{ title: "Book A" }, { title: "Book B" }];
      Book.find.mockResolvedValue(books);
      await getBooks(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(books);
    });
  });

  // ── createBook ───────────────────────────────────────────────────────────

  describe("createBook", () => {
    it("returns 400 when Joi validation fails", async () => {
      validate.mockReturnValue({ error: { details: [{ message: '"title" is required' }] } });
      await createBook(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('"title" is required');
    });

    it("returns 400 when a book with the same title already exists", async () => {
      validate.mockReturnValue({ error: null });
      req.body = { title: "Existing Book", author: "Author" };
      Book.findOne.mockResolvedValue({ title: "Existing Book" });

      await createBook(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Book already exists");
    });

    it("returns 201 with the saved book on success", async () => {
      validate.mockReturnValue({ error: null });
      req.body = { title: "New Book", author: "Author" };
      Book.findOne.mockResolvedValue(null);
      const mockInstance = { title: "New Book", author: "Author", save: jest.fn().mockResolvedValue() };
      Book.mockImplementation(() => mockInstance);

      await createBook(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(mockInstance);
    });
  });

  // ── deleteBook ───────────────────────────────────────────────────────────

  describe("deleteBook", () => {
    it("returns 400 for an invalid ObjectId", async () => {
      req.params.id = "not-an-id";
      mockIsValid.mockReturnValue(false);

      await deleteBook(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid ID" });
    });

    it("returns 404 when book does not exist", async () => {
      req.params.id = VALID_ID;
      mockIsValid.mockReturnValue(true);
      Book.findByIdAndDelete.mockResolvedValue(null);

      await deleteBook(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Book not found" });
    });

    it("returns 200 with success message on deletion", async () => {
      req.params.id = VALID_ID;
      mockIsValid.mockReturnValue(true);
      Book.findByIdAndDelete.mockResolvedValue({ title: "Deleted" });

      await deleteBook(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: "Book deleted" });
    });
  });

  // ── updateBook ───────────────────────────────────────────────────────────

  describe("updateBook", () => {
    it("returns 400 for an invalid ObjectId", async () => {
      req.params.id = "bad-id";
      mockIsValid.mockReturnValue(false);

      await updateBook(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid ID" });
    });

    it("returns 400 when Joi validation fails", async () => {
      req.params.id = VALID_ID;
      mockIsValid.mockReturnValue(true);
      validate.mockReturnValue({ error: { details: [{ message: '"author" is required' }] } });

      await updateBook(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: '"author" is required' });
    });

    it("returns 404 when book does not exist", async () => {
      req.params.id = VALID_ID;
      mockIsValid.mockReturnValue(true);
      validate.mockReturnValue({ error: null });
      Book.findByIdAndUpdate.mockResolvedValue(null);

      await updateBook(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Book not found" });
    });

    it("returns 200 with updated book on success", async () => {
      const updatedBook = { _id: VALID_ID, title: "Updated Title", author: "Author" };
      req.params.id = VALID_ID;
      req.body = { title: "Updated Title", author: "Author" };
      mockIsValid.mockReturnValue(true);
      validate.mockReturnValue({ error: null });
      Book.findByIdAndUpdate.mockResolvedValue(updatedBook);

      await updateBook(req, res);

      expect(Book.findByIdAndUpdate).toHaveBeenCalledWith(
        VALID_ID,
        { $set: req.body },
        { new: true, runValidators: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedBook);
    });
  });
});
