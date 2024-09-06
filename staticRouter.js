const express = require("express");
const URL = require("./models-url2");
const { restrictTo } = require("./middlewares/auth");

const router = express.Router();

router.get("/admin/urls",restrictTo(["NORMAL"]),async(req,res )=>{
    const allurls = await URL.find({});
    return res.render("home" ,{
        urls :allurls,
    }) 
})

router.get("/",restrictTo(["NORMAL","ADMIN"]),async(req,res )=>{
    const allurls = await URL.find({});
    return res.render("home" ,{
        urls :allurls,
    }) 
})

router.get("/signup", (req,res) =>{
    return res.render("signup");
})
router.get("/login", (req,res) =>{
    return res.render("login");
})

module.exports = router;