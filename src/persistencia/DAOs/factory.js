import UserMongo from "./mongoDAO/usersManager.js";

let usersManager;
const persistencia = process.argv[2];
switch (persistencia) {
  case "MONGO":
    usersManager = new UserMongo();
    break;
  default:
    break;
}

export default usersManager;