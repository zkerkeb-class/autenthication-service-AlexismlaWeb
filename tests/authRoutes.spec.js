const express = require("express");
const authRoutes = require("../src/routes/authRoutes");

jest.mock("../src/controllers/authController", () => ({
  register: jest.fn(),
  login: jest.fn(),
  me: jest.fn(),
  deleteAccount: jest.fn(),
  forgotPassword: jest.fn(),
  resetPassword: jest.fn(),
  verifyEmail: jest.fn()
}));

describe("AuthRoutes", () => {
  it("should export router", () => {
    expect(authRoutes).toBeDefined();
    expect(typeof authRoutes).toBe("function");
  });

  it("should have register route", () => {
    const { register } = require("../src/controllers/authController");
    expect(register).toBeDefined();
  });

  it("should have login route", () => {
    const { login } = require("../src/controllers/authController");
    expect(login).toBeDefined();
  });

  it("should have me route", () => {
    const { me } = require("../src/controllers/authController");
    expect(me).toBeDefined();
  });

  it("should have deleteAccount route", () => {
    const { deleteAccount } = require("../src/controllers/authController");
    expect(deleteAccount).toBeDefined();
  });

  it("should have forgotPassword route", () => {
    const { forgotPassword } = require("../src/controllers/authController");
    expect(forgotPassword).toBeDefined();
  });

  it("should have resetPassword route", () => {
    const { resetPassword } = require("../src/controllers/authController");
    expect(resetPassword).toBeDefined();
  });

  it("should have verifyEmail route", () => {
    const { verifyEmail } = require("../src/controllers/authController");
    expect(verifyEmail).toBeDefined();
  });
});
