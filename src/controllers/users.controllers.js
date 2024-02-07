import { createOne, findAll, findById } from "../services/users.service.js";

export const findUser = (req, res) => {
  const users = findAll();
  res.status(200).json({ users });
};

export const findUserById = (req, res) => {
  const { idUser } = req.params;
  const user = findById(+idUser);

  if (!user) {
    res.status(404).json({ message: "No user found whit id provided" });
  }
  res.status(200).json({ message: "User found", user });
};

export const createUser = (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  if (!first_name || !last_name || !email || !password) {
    res.status(400).json({ message: "All fields are required" });
  }

  const createdUser = createOne(req.body);
  res.status(200).json({ message: "User created", user: createdUser });
};