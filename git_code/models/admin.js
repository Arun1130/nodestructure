const mongoose = require("mongoose");
const Schema = mongoose.Schema({
  email: {type: String,useCreateIndex: true},
  password: {type: String,useCreateIndex: true}
});

module.exports =  mongoose.model("admin_data", Schema, "admin_data");