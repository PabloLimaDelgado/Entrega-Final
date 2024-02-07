import passport from "passport";
import { Router } from "express";

const router = Router();

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { successRedirect: "/profile" })
);

router.post(
  "/singup",
  passport.authenticate("singup", {
    successRedirect: "/home",
    failureRedirect: "/error",
  })
);

router.post(
  "/login",
  passport.authenticate("login", {
    successRedirect: "/home",
    failureRedirect: "/error",
  })
  
);

export default router;