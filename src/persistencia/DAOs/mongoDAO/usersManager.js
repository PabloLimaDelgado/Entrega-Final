import { usersModel } from "../../db/models/users.model.js";
import { productsManager } from "./productsManager.js";

class UsersManager {
  constructor() {
    this.model = usersModel;
  }

  async findAll() {
    return this.model.find().populate("cart");
  }

  async findById(id) {
    return this.model.findById(id).populate("cart");
  }

  async findByEmail(email) {
    return this.model
      .findOne({ email })
      .populate({ path: "cart", populate: { path: "products.product" } });
  }

  async createOne(obj) {
    return this.model.create(obj);
  }

  async updateOne(id, obj) {
    return this.model.updateOne({ _id: id }, obj);
  }

  async deleteOne(id) {
    return this.model.deleteOne({ _id: id });
  }

  async createProduct(user, productData) {
    // Verificar si el usuario es premium antes de permitir la creación de productos
    if (user.rol === "premium") {
      // Agregar el correo electrónico del usuario como owner del producto
      productData.owner = user.email;
    }

    const createdProduct = await productsManager.createOne(productData);

    // Agregar el producto creado al usuario si es premium
    if (user.rol === "premium") {
      await this.addProductToUser(user._id, createdProduct._id);
    }

    return createdProduct;
  }
}

export const usersManager = new UsersManager();
