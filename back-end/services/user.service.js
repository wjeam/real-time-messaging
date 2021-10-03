const mongoose = require("mongoose");
const User = mongoose.model("User");
const auth = require("./auth.service");

exports.findAll = async (res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((error) => console.error(error));
};

exports.register = async (req, res) => {
  User.find({
    $or: [{ email: req.body.email }, { username: req.body.username }],
  })
    .then((user) => {
      user = user[0] || req.body;
      if (user?._id) {
        res.status(409).send("E-mail or username already exists.");
      } else {
        auth
          .encryptPassword(user.password)
          .then((hash) => {
            user.password = hash;
            createAccount(res, user);
          })
          .catch((error) => console.error(error));
      }
    })
    .catch((error) => console.error(error));
};

const createAccount = async (res, user) => {
  User.create(user)
    .then(() => {
      res.status(200).send("Account created");
    })
    .catch((error) => {
      res.status(400).send("Error creating account");
      console.error(error);
    });
};

exports.findByUsernameOrEmail = async (req, res) => {
  return User.findOne({
    $or: [{ email: req.body.identifier }, { username: req.body.identifier }],
  })
    .select("-password")
    .then((user) => {
      if (user?._id) {
        return user;
      } else {
        return undefined;
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

exports.login = async (req, res) => {
  User.findOne({
    $or: [{ email: req.body.identifier }, { username: req.body.identifier }],
  })
    .then((user) => {
      if (user) {
        auth
          .validatePassword(req.body.password, user.password)
          .then((isValid) => {
            if (isValid) {
              auth.signToken(res, user._id, user.email, user.username);
            } else {
              res.status(401).send("Password incorrect");
            }
          })
          .catch((error) => {
            res
              .status(400)
              .send("Error comparing passwords, please try again later");
            console.error(error);
          });
      } else {
        res.status(404).send("Account not found");
      }
    })
    .catch((error) => {
      res.status(400).send("Error logging you in, please try again later");
      console.error(error);
    });
};
