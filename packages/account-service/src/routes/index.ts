import express from "express";
import * as authController from "../controllers/auth-controller";
import * as userController from "../controllers/user-controller";

const router = express.Router();

// Auth
router.post("/account/signin", authController.signInUser);
router.get("/account/validate-session", authController.getSession);

// User
router.get("/account/me", userController.getSessionUser);
router
  .route("/account/users/search")
  .get(userController.searchUsers)
  .post(userController.getUsersByIds);

export { router };
