import { Router } from "express";
import {
  findUser,
  findUserById,
  createUser,
} from "../controllers/users.controller.js";

import { isAdmin } from "../middlewares/authUser.middleware.js";

const router = Router();

router.get("/", isAdmin, findUser);
router.get("/:idUser", isAdmin, findUserById);
router.post("/", isAdmin, createUser);

export default router;