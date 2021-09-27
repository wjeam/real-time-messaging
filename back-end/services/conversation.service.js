const mongoose = require("mongoose");
const message = require("../models/message");
const Conversation = mongoose.model("Conversation");
const { findByUsernameOrEmail } = require("./user.service");

exports.createConversation = async (req, res) => {
  const conversation = req.body;
  Conversation.create(conversation)
    .then((conversation) => {
      const newConversation = { ...conversation }._doc;
      delete newConversation.users;
      res.status(200).send(newConversation);
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("");
    });
};

exports.findUsersFromConversationId = async (conversation_id) => {
  return Conversation.find({ _id: conversation_id })
    .populate({
      path: "users",
      select: "-password -email -__v -creation_date -profile_image -username",
    })
    .select("-messages -creation_date -password -title -__v -_id");
};

exports.insertUser = async (req, res) => {
  const user = await findByUsernameOrEmail(req, res);
  if (user) {
    Conversation.updateOne(
      { _id: req.body.conversation_id },
      { $addToSet: { users: user._id } }
    )
      .then(() => {
        res.status(200).send(user._id);
      })
      .catch((error) => {
        console.error(error);
        res.status(400).send("");
      });
  } else {
    res.status(200).send("User not found");
  }
};

exports.insertMessage = async (message) => {
  Conversation.findOneAndUpdate(
    { _id: message.conversation_id },
    { $push: { messages: message.message_id } }
  ).catch((error) => {
    console.error(error);
  });
};

exports.findConversationById = async (id) => {
  return Conversation.findOne({ _id: id })
    .populate({
      path: "messages",
      populate: {
        path: "user_id",
        select: "-password",
      },
    })
    .select("-users");
};

exports.findConversationsByUserId = async (req, res) => {
  const user_id = req.params.user_id;

  Conversation.find({ users: { $in: [user_id] } })
    .select("-users")
    .populate({
      path: "messages",
      populate: {
        path: "user_id",
        select: "-password",
      },
    })
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("");
    });
};
