const mongoose = require("mongoose");
const Schema = mongoose.Schema({
  stud_id: {type: String,useCreateIndex: true},
  name: {type: String,useCreateIndex: true},
  age: {type: Number,useCreateIndex: true},
  class:{type: String,useCreateIndex: true},
  english: {type: Number,useCreateIndex: true},
  tamil: {type: Number,useCreateIndex: true},
  science: {type: Number,useCreateIndex: true},
  social: {type: Number,useCreateIndex: true},
  maths: {type: Number,useCreateIndex: true},
  stud_location:{type:Object,useCreateIndex: true},
  created_at: {type: Number,useCreateIndex: true},
  modfied_at:{type: Number,useCreateIndex: true},
});

module.exports =  mongoose.model("student_data", Schema, "student_data");