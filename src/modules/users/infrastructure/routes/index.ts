import express from "express";
import {
  registerUserViaEmailController,
  loginUserViaEmailController,
  verifyUserController,
  sendVerificationController,
  forgotPasswordController,
} from "../../adapters/controllers";
import {
  authenticateUserMiddleware,
  sendVerificationMiddleware,
} from "../../adapters/middleware";

const userRouter = express.Router();

userRouter.post(
  "/register",
  registerUserViaEmailController.execute,
  sendVerificationMiddleware.execute
);

userRouter.post("/login", loginUserViaEmailController.execute);

userRouter.put("/:id/verify/:token", verifyUserController.execute);

userRouter.get(
  "/:id/send-verification",
  authenticateUserMiddleware.execute,
  sendVerificationController.execute
);

userRouter.post("/forgot-password", forgotPasswordController.execute);

export { userRouter };
