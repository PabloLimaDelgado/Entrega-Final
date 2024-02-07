import { usersManager } from "../persistencia/DAOs/mongoDAO/usersManager.js";
import { hashData } from "../utils.js";
import UserDTO from "../persistencia/DTOs/user.dto.js";

export const findAll = () => {
  const users = usersManager.findAll();
  return users;
};

export const findById = (id) => {
  const user = usersManager.findById(id);
  return user;
};

export const createOne = (obj) => {
  const hashPassword = hashData(obj.password);
  const userDTO = new UserDTO({ ...obj, password: hashPassword });
  const userCreated = usersManager.createOne({ userDTO });

  const response = {
    welcome_string: `Welcome ${userCreated.first_name} ${userCreated.last_name}`,
    email: userCreated.email,
    password: userCreated.password,
  };

  return response;
};

export const modifyProduct = async (productId, newData, user) => {
  const product = await productsModel.findById(productId);

  if (!product) {
    throw new Error("Producto no encontrado");
  }

  // Verificar permisos
  if (
    user.rol === "admin" ||
    (user.rol === "premium" && product.owner === user.email)
  ) {
    // Permitir la modificación
    await productsModel.updateOne({ _id: productId }, newData);
    return "Producto modificado exitosamente";
  } else {
    throw new Error("No tienes permisos para modificar este producto");
  }
};

export const deleteProduct = async (productId, user) => {
  const product = await productsModel.findById(productId);

  if (!product) {
    throw new Error("Producto no encontrado");
  }

  // Verificar permisos
  if (
    user.rol === "admin" ||
    (user.rol === "premium" && product.owner === user.email)
  ) {
    // Permitir la eliminación
    await productsModel.deleteOne({ _id: productId });
    return "Producto eliminado exitosamente";
  } else {
    throw new Error("No tienes permisos para eliminar este producto");
  }
};