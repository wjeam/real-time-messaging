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
      res.status(400).send("Error creating conversation");
    });
};

exports.deleteConversationById = async (req, res) => {
  const id = req.params.conversation_id;
  Conversation.deleteOne({
    _id: id,
  })
    .then((result) => {
      if (result.deletedCount === 0)
        res.status(404).send("Conversation not found");
      else res.status(200).send("Conversation deleted");
    })
    .catch((error) => console.error(error));
};

exports.deleteUserByConversationId = async (req, res) => {
  Conversation.updateOne(
    { _id: req.body.conversation_id },
    { $pull: { users: req.body.user_id } },
    { multi: true }
  )
    .then((response) => {
      if (response.modifiedCount === 1)
        res.status(200).send("User removed from conversation");
      else if (response.matchedCount === 0)
        res.status(404).send("Conversation not found");
      else res.status(404).send("User not part of this conversation");
    })
    .catch((error) => {
      console.error(error);
    });
};

exports.deleteAllMessagesById = async (req, res) => {
  Conversation.updateMany(
    { _id: req.body.conversation_id },
    { $set: { messages: [] } }
  )
    .then(() => {
      res.status(200).send("Conversation cleared");
    })
    .catch((error) => console.error(error));
};

exports.findUsersByConversationId = async (conversation_id) => {
  return Conversation.find({ _id: conversation_id })
    .populate({
      path: "users",
      select: "-password -email -__v -creation_date -profile_image -username",
    })
    .select("-messages -creation_date -password -title -__v -_id");
};

exports.updateTitleByConversationId = async (req, res) => {};

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
        res.status(400).send("Error adding user to conversation");
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
    .populate({
      path: "users",
      select: "-password -creation_date -email -username -__v -password",
    });
};

exports.updateConversationTitleById = async (req, res) => {
  const conversation = req.body;
  Conversation.findOneAndUpdate(
    { _id: conversation.conversation_id },
    {
      title: conversation.title,
    },
    { new: true }
  )
    .then((updatedConversation) => {
      res.status(200).send(updatedConversation.title);
    })
    .catch((error) => {
      console.error(error);
      res.status(401);
    });
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
