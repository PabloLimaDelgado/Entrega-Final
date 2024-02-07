import { Router } from "express";
import { usersManager } from "../persistencia/DAOs/mongoDAO/usersManager.js";
import { productsManager } from "../managers/productsManager.js";

const router = Router();

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/createproduct", (req, res) => {
  res.render("createProduct");
});

router.get("/home", (req, res) => {
  //console.log(req);
  res.render("home", { first_name: req.user.first_name });
});

router.get("/error", (req, res) => {
  res.render("error");
});

router.get("/home/:idUser", async (req, res) => {
  const { idUser } = req.params;
  const userInfo = await usersManager.findById(idUser);
  const { first_name, last_name } = userInfo;
  const products = await productsManager.findAll();
  res.render("home", { first_name, last_name, products });
});

router.get("/profile", (req, res) => {
  res.render("profile");
});
export default router;