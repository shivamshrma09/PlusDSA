import express from "express";
import {
  sendOTP,
  verifyOTP,
  logout,
  getCurrentUser,
  loginUser,
} from "../controllers/auth.controller";
import { authenticate } from "../middleware/cookie-auth.middleware";

const router = express.Router();

router.post("/send-otp", sendOTP);

router.post("/login", loginUser);
router.post("/verify-otp", verifyOTP);
router.post("/verify-login", verifyOTP);

router.get("/google", (req, res) => {
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&response_type=code&scope=profile email`;
  res.redirect(googleAuthUrl);
});

router.post("/logout", logout);

router.get("/me", authenticate, getCurrentUser);

export default router;


















































































