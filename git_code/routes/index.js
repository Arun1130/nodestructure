var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
var stud_data = require('../models/studentData')
var admin = require('../models/admin')
const bodyParser = require('body-parser')
const { check, validationResult } = require('express-validator');
var config = require('../config/devel')
var common = require('../helpers/common')
var jwt = require('jsonwebtoken');
var multer = require('multer');
var storage = multer.diskStorage
const upload = multer({ dest: 'C:/Users/asvith/Desktop/node/models/' })




/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({ status: 200, "data": "successfull" })
});

//signup
router.post("/signup", [
  check('email', 'invalid value, must be email').isEmail(),
  check(
    "password",
    "Please enter a password at least 8 character and contain At least one uppercase.At least one lower case.At least one special character. ",
  )
.isLength({ min: 8 })
.matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/,
      )
], async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.json(errors.array())
    }
    else {

      const data = req.body
      let obj = {
        email:common.encrypt(data.email),
        password:common.encrypt(data.password),
        created_at:Date.now()
      }
      var findData = await admin.find({email:common.encrypt(data.email)})
      if(findData.length > 0){
        res.json({"status":false,"message":"This email already exist !!!"})
      }
      else{
        var createData = await admin.create(obj)
        if(createData){
          res.json({"status":true,"message":"Successfully registerd"})
        }
        else{
          res.json({"status":false,"message":"Something err. Data doesn't registerd"})
        }
      }
    }
  }
  catch (e) {
    console.log(e)
    res.json(e)
  }
})


//login
router.post("/login", [
  check('email', 'invalid value, must be email').isEmail(),
  check(
    "password",
    "Please enter a password at least 8 character and contain At least one uppercase.At least one lower case.At least one special character. ",
  )
.isLength({ min: 8 })
.matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/,
      )
], async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.json(errors.array())
    }
    else {
      const data = req.body
      var findData = await admin.find({$and:[
        {email:common.encrypt(data.email)},
        {password:common.encrypt(data.password)}
      ]})
      if(findData.length > 0){
        var token = jwt.sign({"_id":findData._id},config.jwt_key)
        res.json({"status":true,"token":token,"message":"Login successfull"})
      }
      else{
        res.json({"status":false,"message":"Invalid credentitals"})
      }
    }
  }
  catch (e) {
    console.log(e)
    res.json(e)
  }
})


//add student list
router.post("/add_stud_data", common.ensureTokenn,[
  check('stud_id', 'invalid value, must be string').isString(),
  check('name', 'invalid value, must be string').isString(),
  check('age', 'invalid value, must be number').isNumeric(),
  check('class', 'invalid value, must be string').isString(),
  check('stud_location', 'invalid value, must be object').isObject(),
], async (req, res, next) => {
  try {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.json(errors.array())
    }
    else {

      const data = req.body
      let obj = {
        stud_id:data.stud_id,
        name:data.name,
        age:data.age,
        class:data.class,
        stud_location:data.stud_location,
        created_at:Date.now()
      }
      var findData = await stud_data.find({stud_id:data.stud_id})
      if(findData.length > 0){
        res.json({"status":false,"message":"This student id already added !!!"})
      }
      else{
        var createData = await stud_data.create(obj)
        if(createData){
          res.json({"status":true,"message":"Successfully added"})
        }
        else{
          res.json({"status":false,"message":"Something err. Data doesn't added"})
        }
      }
    }
  }
  catch (e) {
    console.log(e)
    res.json(e)

  }
})

//get stud data
router.get('/get_stud_data',common.ensureTokenn,async(req,res)=>{
  try{
    var findData = await stud_data.find({}).sort({"_id":-1})
    if(findData.length > 0){
      res.json({"status":true,"message":"Data fetched","data":findData})
    }
    else{
      res.json({"status":false,"message":"Data doesn't found", "data":[]})
    }
  }
  catch(e){
    res.json(e)
  }
})

//update data
router.post("/update_stud_data", common.ensureTokenn,[
  check('_id', 'invalid value, must be string').isString(),
  check('age', 'invalid value, must be number').isNumeric().optional(),
  check('class', 'invalid value, must be string').isString().optional(),
  check('stud_location', 'invalid value, must be object').isObject().optional(),
  check('maths', 'invalid value, must be number').isNumeric().optional(),
  check('english', 'invalid value, must be number').isNumeric().optional(),
  check('tamil', 'invalid value, must be number').isNumeric().optional(),
  check('science', 'invalid value, must be number').isNumeric().optional(),
  check('social', 'invalid value, must be number').isNumeric().optional(),
], async (req, res, next) => {
  try {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.json(errors.array())
    }
    else {

      const data = req.body
      let obj = {
        age:data.age,
        class:data.class,
        stud_location:data.stud_location,
        maths:data.maths,
        english:data.english,
        tamil:data.tamil,
        science:data.science,
        social:data.social,
        modfied_at:data.modfied_at
      }
      var updateData = await stud_data.updateOne({"_id":data._id},{
        $set:obj
      })
      if(updateData.modifiedCount == 1){
        res.json({"status":true,"message":"Data updated"})
      }
      else{
          res.json({"status":false,"message":"Data doesn't updated"})
      }
    }
  }
  catch (e) {
    console.log(e)
    res.json(e)

  }
})

router.post('/delete_stud_data',common.ensureTokenn,async(req,res)=>{
  try{
    const data = req.body
    var findData = await stud_data.find({"_id":data._id})
    if(findData.length > 0){
      var deleteData = await stud_data.deleteOne({"_id":data._id})
      if(deleteData.deletedCount == 1){
        res.json({"status":true,"message":"Data deleted"})
      }
      else{
        res.json({"status":false,"message":"Data does not deleted"})
      }
    }
    else{
      res.json({"status":false,"message":"Data does not found"})
    }
  }
  catch(e){
    res.json(e)
  }
})

router.post('/file_uplod',common.ensureTokenn,upload.single("image"),async(req,res)=>{
  try{
    res.json({"status":true,"message":"file uploded","data":req.file})
  }
  catch(e){
    res.json(e)
  }
})

module.exports = router;
