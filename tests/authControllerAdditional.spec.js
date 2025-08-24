const axios = require("axios");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { register, login, me, deleteAccount, forgotPassword, resetPassword } = require("../src/controllers/authController");

jest.mock("axios");
jest.mock("bcryptjs");
jest.mock("crypto");

describe("AuthController - Additional Tests", () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = { body: {}, params: {}, user: { id: "test-user-id" } };
    mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should handle server error during registration", async () => {
      mockReq.body = { email: "test@example.com", password: "password123" };
      axios.get.mockRejectedValue({ response: { status: 404 } });
      bcrypt.hash.mockResolvedValue("hashedPassword");
      crypto.randomBytes.mockReturnValue({ toString: () => "mockToken" });
      axios.post.mockRejectedValue(new Error("Database error"));
      
      await register(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Erreur serveur" });
    });
  });

  describe("login", () => {
    it("should handle server error during login", async () => {
      mockReq.body = { email: "test@example.com", password: "password123" };
      axios.get.mockRejectedValue(new Error("Database error"));
      
      await login(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Erreur serveur" });
    });
  });

  describe("me", () => {
    it("should handle server error during me", async () => {
      axios.get.mockRejectedValue(new Error("Database error"));
      
      await me(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Erreur serveur" });
    });
  });

  describe("deleteAccount", () => {
    it("should handle server error during delete", async () => {
      mockReq.params = { userId: "user-id" };
      axios.delete.mockRejectedValue(new Error("Database error"));
      
      await deleteAccount(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Erreur serveur" });
    });
  });

  describe("forgotPassword", () => {
    it("should handle server error during forgot password", async () => {
      mockReq.body = { email: "test@example.com" };
      axios.get.mockRejectedValue(new Error("Database error"));
      
      await forgotPassword(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Erreur serveur." });
    });
  });

  describe("resetPassword", () => {
    it("should handle server error during reset password", async () => {
      mockReq.body = { token: "valid-token", newPassword: "newpassword123" };
      axios.get.mockRejectedValue(new Error("Database error"));
      
      await resetPassword(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Erreur serveur." });
    });
  });
});
