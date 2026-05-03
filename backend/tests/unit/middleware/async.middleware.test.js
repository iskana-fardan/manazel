const asyncMiddleware = require("../../../src/middleware/async.middleware");

describe("asyncMiddleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {};
    next = jest.fn();
  });

  it("calls the handler with req and res", async () => {
    const handler = jest.fn().mockResolvedValue();
    await asyncMiddleware(handler)(req, res, next);
    expect(handler).toHaveBeenCalledWith(req, res);
  });

  it("does not call next when handler resolves successfully", async () => {
    const handler = jest.fn().mockResolvedValue();
    await asyncMiddleware(handler)(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next with the thrown error when handler rejects", async () => {
    const err = new Error("async failure");
    const handler = jest.fn().mockRejectedValue(err);
    await asyncMiddleware(handler)(req, res, next);
    expect(next).toHaveBeenCalledWith(err);
  });

  it("calls next with a synchronous error thrown inside handler", async () => {
    const err = new Error("sync throw");
    const handler = jest.fn().mockImplementation(() => {
      throw err;
    });
    await asyncMiddleware(handler)(req, res, next);
    expect(next).toHaveBeenCalledWith(err);
  });
});
