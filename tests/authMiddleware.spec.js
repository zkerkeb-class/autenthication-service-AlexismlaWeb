const jwt = require("jsonwebtoken");
const authMiddleware = require("../src/middleware/authMiddleware");

jest.mock("jsonwebtoken");

describe("AuthMiddleware", () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = { headers: {} };
    mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 401 for missing authorization header", () => {
    authMiddleware(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Non autorisé, token manquant" });
  });

  it("should return 401 for invalid authorization format", () => {
    mockReq.headers.authorization = "InvalidFormat token";
    authMiddleware(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Non autorisé, token manquant" });
  });

  it("should return 401 for invalid token", () => {
    const mockToken = "invalid.jwt.token";
    mockReq.headers.authorization = `Bearer ${mockToken}`;
    jwt.verify.mockImplementation(() => { throw new Error("Invalid token"); });
    authMiddleware(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Token invalide" });
  });
});
