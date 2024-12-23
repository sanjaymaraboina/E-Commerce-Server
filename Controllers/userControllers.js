const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

const USER_JWT_SECRET = process.env.USER_JWT_SECRET;


exports.register = async (req, res) => {
  const {
    fullname,
    email,
    mobile,
    password,
    profilePicture
  } = req.body;

  let errors = {};

  if (!fullname) errors.fullname = "Full name is required.";
  if (!email) errors.email = "Email is required.";
  if (!mobile) errors.mobile = "Contact number is required.";
  if (!password) errors.password = "Password is required.";
  if (!profilePicture) errors.profilePicture = "profilePicture is required.";


  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullname,
      email,
      mobile,
      password: hashedPassword,
      profilePicture
     
    });
    await newUser.save();
    res.status(201).send("User registered");
  } catch (err) {
    res.status(500).json({ error: "Error registering user", message: err.message });
  }
};
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const normalizedEmail = email.toLowerCase();
    
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ error: "Invalid Email" });
    }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ error: "Invalid Password" });
  }

  const token = jwt.sign({ userId: user._id }, USER_JWT_SECRET, {
    expiresIn: "1h",
  });
  const id = user._id;
  res.send({ token, id });
} catch (err) {
  return res.status(500).json({ error: "An unexpected error occurred." });
}

  
};

exports.authEmployeeMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send("Access denied");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, USER_JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send("Invalid token");
  }
};

exports.getPersonalDetails = async (req, res) => {
  try {
    const { id } = req.query;
    console.log(id);
    const personalDetails = await User.findById(id).select(
      "fullname email mobile profilePicture "
    );
    console.log(personalDetails);

    res.status(200).json(personalDetails);
  } catch (error) {
    res.status(500).send("Error in getting User Details");
  }
};

exports.updatePersonalDetails = async (req, res) => {
  const { fullname, mobile,  } = req.body;
  const id = req.params.id;

  try {
    const updatedDetails = await User.findByIdAndUpdate(
      id,
      { fullname, mobile,  },
      { new: true, runValidators: true }
    );
    const personalDetails = await User.findById(id).select(
      "fullname email mobile "
    );

    if (!updatedDetails) {
      return res.status(404).send({ message: "Product not found" });
    }

    res
      .status(200)
      .json({ message: "Product updated successfully", Details: personalDetails });
  } catch (error) {
    res
      .status(500)
      .send({ message: `Error while updating product: ${error.message}` });
  }
};
