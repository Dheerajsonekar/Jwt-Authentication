const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required : [true, "username is required"],
        unique: true,
    },
    dob: {
        type: Date,
        
    },
    email:{
      type: String,
      required: [true, "email address is required"],
    },
  password: {
    type: String,
    required: [true, "password is required"],

  },

});

userSchema.pre("save", async function () {
    this.password = await bcrypt.hash(this.password, 12);
});

module.exports = mongoose.model("User", userSchema);