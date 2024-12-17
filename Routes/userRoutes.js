const express = require("express");

const {
  register,
  login,
  getPersonalDetails,
  updatePersonalDetails,
  authEmployeeMiddleware,
} = require("../Controllers/userControllers");
const { getApplication } = require("../Controllers/cartController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/getPersonalDetails", authEmployeeMiddleware, getPersonalDetails);
router.get("/updatePersonalDetails", authEmployeeMiddleware, updatePersonalDetails);



router.get("/cartItems", authEmployeeMiddleware, getApplication);

module.exports = router;
