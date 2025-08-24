const axios = require("axios");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { register, login, me, deleteAccount, forgotPassword, resetPassword } = require("../src/controllers/authController");

jest.mock("axios");
jest.mock("bcryptjs");
jest.mock("crypto");

describe("AuthController", () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = { body: {}, params: {}, user: { id: "test-user-id" } };
    mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should return error if user already exists", async () => {
      mockReq.body = { email: "existing@example.com", password: "password123" };
      axios.get.mockResolvedValue({ data: { id: "existing-user" } });
      await register(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Cet utilisateur existe déjà." });
    });
  });

  describe("login", () => {
    it("should return error for invalid credentials", async () => {
      mockReq.body = { email: "test@example.com", password: "wrongpassword" };
      axios.get.mockResolvedValue({ data: null });
      await login(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Email ou mot de passe invalide." });
    });

    it("should return error for wrong password", async () => {
      mockReq.body = { email: "test@example.com", password: "wrongpassword" };
      const mockUser = { id: "user-id", email: "test@example.com", password: "hashedPassword" };
      axios.get.mockResolvedValue({ data: mockUser });
      bcrypt.compare.mockResolvedValue(false);
      await login(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Email ou mot de passe invalide." });
    });
  });

  describe("me", () => {
    it("should return user profile", async () => {
      const mockUser = { id: "user-id", email: "test@example.com" };
      axios.get.mockResolvedValue({ data: mockUser });
      await me(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ user: mockUser });
    });
  });

  describe("deleteAccount", () => {
    it("should delete account successfully", async () => {
      mockReq.params = { userId: "user-id" };
      axios.delete.mockResolvedValue({});
      await deleteAccount(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Compte supprimé avec succès." });
    });
  });

  describe("forgotPassword", () => {
    it("should return error for non-existent email", async () => {
      mockReq.body = { email: "nonexistent@example.com" };
      axios.get.mockResolvedValue({ data: null });
      await forgotPassword(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Aucun compte avec cet email." });
    });
  });

  describe("resetPassword", () => {
    it("should return error for missing fields", async () => {
      mockReq.body = { token: "valid-token" };
      await resetPassword(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Champs manquants." });
    });

    it("should return error for expired token", async () => {
      mockReq.body = { token: "expired-token", newPassword: "newpassword123" };
      const mockUser = { id: "user-id", resetTokenExpires: new Date(Date.now() - 1000 * 60 * 30).toISOString() };
      axios.get.mockResolvedValue({ data: mockUser });
      await resetPassword(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Token invalide ou expiré." });
    });
  });
});
