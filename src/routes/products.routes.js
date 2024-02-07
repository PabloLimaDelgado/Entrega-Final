import { Router } from "express";
import { productsManager } from "../managers/productsManager.js";

const router = Router();

router.post("/", async (req, res) => {
  const { name, price, stock } = req.body;
  if (!name || !price) {
    return res.status(400).json({ message: "Name and price are required" });
  }
  if (!stock) {
    delete req.body.stock;
  }
  try {
    const createdProduct = await productsManager.createOne(req.body);
    res
      .status(200)
      .json({ message: "Product created", product: createdProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  const products = await productsManager.findAllProducts(req.query);
  res.json({ products });
});

router.delete("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    const userId = product.userId;
    await ProductModel.findByIdAndDelete(productId);

    const user = await UserModel.findById(userId);
    if (user && user.isPremium) {
      await sendEmail(user.email, "Producto eliminado", `Su producto "${product.name}" ha sido eliminado.`);
    }

    res.status(200).json({ message: "Producto eliminado correctamente." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
});

export default router;