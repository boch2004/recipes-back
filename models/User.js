const { default: _default } = require("concurrently");
const mongoose = require("mongoose");
const schema = mongoose.Schema;
const UserSchema = new schema({
  name: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: "user",
  },

  img: {
    type: String,
  },
});

module.exports = mongoose.model("user", UserSchema);
