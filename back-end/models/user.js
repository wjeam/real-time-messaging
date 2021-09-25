module.exports = (mongoose) => {
  const User = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile_image: { type: String, default: "default.png" },
    creation_date: { type: Date, default: Date.now },
  });

  return User;
};
