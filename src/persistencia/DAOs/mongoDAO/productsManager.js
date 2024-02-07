import { productsModel } from "../../db/models/products.model.js";

class ProductsManager {
  constructor() {
    this.model = productsModel;
  }

  async createOne(productData) {
    return this.model.create(productData);
  }
}

export const productsManager = new ProductsManager();
