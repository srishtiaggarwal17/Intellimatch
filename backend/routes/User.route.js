import express from "express";
import {
  registerUser,
  loginUser,
  getUser,
  logoutUser,
  getHistory,
  getMatchDetails
} from "../controllers/User.controller.js";
import isAuthenticated from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/get", isAuthenticated, getUser);
router.post("/logout", logoutUser);
router.get("/history", isAuthenticated, getHistory);
router.get("/match/:matchId", isAuthenticated, getMatchDetails);

export default router;