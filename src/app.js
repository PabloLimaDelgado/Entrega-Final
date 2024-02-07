import express from "express";
import handlebars from "express-handlebars";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import session from "express-session";
import passport from "passport";
import config from "./config.js";

import viewsRouter from "./routes/views.routes.js";
import usersRouter from "./routes/users.routes.js";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import sessionsRouter from "./routes/sessions.routes.js";
import currentRouter from "./routes/current.routes.js";

import "./persistencia/db/configDB.js";
import "./passport.js";
import { __dirname } from "./utils.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    store: new MongoStore({
      mongoUrl: config.mongo_uri,
    }),
    secret: config.session_secret,
    cookie: { maxAge: 60000 },
  })
);

//PASSPORT
app.use(passport.initialize());
app.use(passport.session());

//HANDLEBARS
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//ROUTES
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/users", usersRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/current", currentRouter);

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});