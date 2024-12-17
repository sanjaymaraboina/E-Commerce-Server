const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
require("dotenv").config();

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET;

exports.register = async (req, res) => {
  const { adminmail, password, } = req.body;

  let errors = {};

  if (!adminmail) errors.companymail = "Admin Email is required";
  if (!password) errors.password = "Password is required";

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ error: errors });
  }

  try {
    const normalizedEmail = adminmail.toLowerCase();

    const existingAdmin = await Admin.findOne({ adminmail: normalizedEmail });
    if (existingAdmin) {
      return res.status(400).json({ error: { adminmail: "Email is already in use" } });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
     
      adminmail: normalizedEmail,
     
      password: hashedPassword,
    
    });

    await newAdmin.save();
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    res.status(500).json({ error: { general: "An unexpected error occurred." } });
  }
};


exports.login = async (req, res) => {
  const { adminmail, password } = req.body;

  const user = await Admin.findOne({ adminmail });
  if (!user) {
    return res.status(400).json({ error: "Invalid Email" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ error: "Invalid Password" });
  }

  const token = jwt.sign({ userId: user._id }, ADMIN_JWT_SECRET, {
    expiresIn: "1h",
  });
  const id = user._id;

  res.send({ token, id });
};

exports.authEmployerMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send("Access denied");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token,ADMIN_JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send("Invalid token");
  }
};
