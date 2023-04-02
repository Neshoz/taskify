import express from "express";
import * as authController from "../controllers/auth-controller";
import * as userController from "../controllers/user-controller";

const router = express.Router();

// Auth
router.post("/signin", authController.signInUser);
router.get("/validate-session", authController.getSession);

// User
router.get("/me", userController.getSessionUser);

export { router };
