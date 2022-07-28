import { Router } from "express";
import {
  currentUser,
  forgotPassword,
  login,
  logout,
  register,
  resetPassword,
} from "../controllers/auth";
import { requireSignin } from "../middlewares/guard";

const AuthRouter = Router();

AuthRouter.post("/register", register);
AuthRouter.post("/login", login);
AuthRouter.get("/logout", logout);
AuthRouter.get("/current-user", requireSignin, currentUser);

AuthRouter.post("/forgot-password", forgotPassword);
AuthRouter.post("/reset-password", resetPassword);

// authRouter.get("/current-user", currentUser);

export default AuthRouter;
