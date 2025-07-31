const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    minlength: 8
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  redirectPage: {
    type: String,
    enum: ["success", "wrong"],
    default: "wrong"
  },
  passwordChangedAt: {
    type: Date,
    select: false
  }
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  
  this.password = await bcrypt.hash(this.password, 10);
  this.passwordChangedAt = Date.now() - 1000; // نطرح ثانية للتأكد من أن التوكن صالح
  next();
});

module.exports = mongoose.model("User", userSchema);