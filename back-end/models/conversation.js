module.exports = (mongoose) => {
  const Conversation = new mongoose.Schema({
    title: { type: String, required: true, default: "New conversation" },
    users: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    messages: [{ type: mongoose.Schema.ObjectId, ref: "Message" }],
    creation_date: { type: Date, default: Date.now },
  });

  return Conversation;
};
