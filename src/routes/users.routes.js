import { Router } from "express";
import { hashData, compareData } from "../utils.js";

import { usersManager } from "../persistencia/DAOs/mongoDAO/usersManager.js";
import { cartsManager } from "../managers/cartsManager.js";
import UserModel from "../../src/persistencia/db/models/users.model.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const users = await usersManager.findAll();
    const filteredUsers = users.map((user) => ({
      nombre: user.first_name,
      correo: user.email,
      rol: user.role,
    }));
    res.status(200).json({ message: "Users", users: filteredUsers });
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
});

// router.get("/:idUser", async (req, res) => {
//   const { idUser } = req.params;
//   try {
//     const user = await usersManager.findById(idUser);
//     res.status(200).json({ message: "User", user });
//   } catch (error) {
//     res.status(500).json({ error: err.message });
//   }
// });

router.post("/", async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: "All data is required" });
  }
  try {
    const hashedPassword = await hashData(password);
    const createdCart = await cartsManager.createOne({ products: [] });
    const createdUser = await usersManager.createOne({
      ...req.body,
      password: hashedPassword,
      cart: createdCart._id,
    });
    res.redirect(`/home/${createdUser._id}`);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const user = await usersManager.findByEmail(email);
    res.status(200).json({ message: "User", user });
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const resetLink = `${req.protocol}://${req.get(
      "host"
    )}/reset-password/${resetToken}`;
    await sendPasswordResetEmail(email, resetLink);

    res.status(200).json({
      message: "Correo electrónico de restablecimiento enviado.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
});

router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Enlace no válido o expirado." });
    }

    const isSamePassword = await compareData(newPassword, user.password);
    if (isSamePassword) {
      return res
        .status(400)
        .json({ message: "No puedes usar la misma contraseña actual." });
    }

    user.password = await hashData(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Contraseña restablecida con éxito." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
});

router.delete("/", async (req, res) => {
  try {
    // Obtener la fecha actual menos 30 minutos
    const cutoffDate = new Date();
    cutoffDate.setMinutes(cutoffDate.getMinutes() - 30);

    const deletedUsers = await UserModel.deleteMany({ lastConnection: { $lt: cutoffDate } });

    const deletedEmails = deletedUsers.map(user => user.email);
    await Promise.all(deletedEmails.map(email => sendEmail(email, "Cuenta eliminada por inactividad", "Su cuenta ha sido eliminada debido a la inactividad.")));

    res.status(200).json({ message: "Usuarios inactivos eliminados correctamente." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
});

export default router;
