const express = require("express");

const {handleUserSignp,handleUserLogin} = require("../controllers/user");

const router = express.Router();

router.post("/",handleUserSignp );
router.post("/login",handleUserLogin );

module.exports = router;