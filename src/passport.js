import passport from "passport";

import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";

import { usersManager } from "./persistencia/DAOs/mongoDAO/usersManager.js";
import { cartsManager } from "./managers/cartsManager.js";

import config from "./config.js";
import { hashData, compareData } from "./utils.js";

//LOCAL STRATEGY
passport.use(
  "signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const userDB = await usersManager.findByEmail(email);

        if (userDB) {
          return done(null, false);
        }

        const hashedPassword = await hashData(password);
        const createdUser = await usersManager.createOne({
          ...req.body,
          password: hashedPassword,
        });

        done(null, createdUser);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        const userDB = await usersManager.findByEmail(email);
        if (!userDB) {
          return done(null, false);
        }
        const isValid = await compareData(password, userDB.password);
        if (!isValid) {
          return done(null, false);
        }
        done(null, userDB);
      } catch (error) {
        done(error);
      }
    }
  )
);

//GOOGLE
passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: config.google_client_id,
      clientSecret: config.google_client_secret,
      callbackURL: config.google_callback_url,
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("profile", profile._json);
      try {
        const user = await usersManager.findByEmail(profile._json.email);
        //LOGIN
        if (user) {
          if (user.fromGoogle) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        }
        // SIGNUP
        const createdCart = await cartsManager.createOne({ products: [] });
        const infoUser = {
          first_name: profile._json.given_name,
          last_name: profile._json.family_name,
          email: profile._json.email,
          password: " ",
          cart: createdCart._id,
          fromGoogle: true,
        };
        const createdUser = await usersManager.createOne(infoUser);
        done(null, createdUser);
      } catch (error) {
        done(error);
      }
      done(null, false);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await usersManager.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});