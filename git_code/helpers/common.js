
var CryptoJS = require("crypto-js");
var AES = require("crypto-js/aes");
var SHA256 = require("crypto-js/sha256");
var jwt = require('jsonwebtoken');
var config = require('../config/devel')

var key = "6Le0DgMTAAAAANokdEEial"; //length=22
var iv  = "mHGFxENnZLbienLyANoi.e"; //length=22

key = CryptoJS.enc.Base64.parse(key); // length=16 bytes

iv = CryptoJS.enc.Base64.parse(iv); // length=16 bytes


  exports.encrypt = ((data)=>{
    var encryp = CryptoJS.AES.encrypt(data, key, { iv: iv }).toString();
    return encryp
  })


  exports.decrypt = ((data)=>{
    var dcryp = CryptoJS.AES.decrypt(data, key, { iv: iv }).toString(CryptoJS.enc.Utf8);
    return dcryp
  })

  exports.ensureTokenn = async(req,res,next)=>{
    const { authorization } = req.headers;
    if(authorization == undefined){
      res.json({"message":"Kindly pass jwt token"})
    }
    else{
    const token = authorization.split(' ')[1];
    const jt = jwt.verify(token, config.jwt_key, (err,data)=>{
      if(err){
        res.status(401).send("Unauthorized");
      }
      else{
        next();
      }
    });
    // if(jt){
    //   next();
    // }
    // else{
    //   res.status(401).send("Unauthorized");
    // }
  }
  }