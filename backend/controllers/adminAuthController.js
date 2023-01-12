const bcrypt = require("bcryptjs");
const Admin = require("../models/adminModel");
const { generateToken } = require('../helpers/generateToken');
const { default: mongoose } = require("mongoose");


// @desc Register a new admin
// @route /api/admin/auth/register
// @method POST
// @access Public
const registerAdmin = async (req, res) => {
  if (!req.body.username || !req.body.password) {
    //return a response to user. The object you pass to the json() is totally up to you.
    // the return keyword is here so that the function doesn't continue running. You don't want to send a res.json() twice, that wouldn't make sense
    
    return res
      .status(400)
      .json({ success: false, message: "Username or Password is empty" });
  }

  let { username, password } = req.body;
  // this line is to make the username supplied by client request to be case INsenSITive. The issue was trying to convert the text to lowercase when you're not even sure if there's a value
  username = username.toLowerCase();

  try {
    // generate a salt needed to hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = await Admin.create({
      username,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      admin: {
        username: newAdmin.username,
        token: generateToken({ id: newAdmin.id }),
      },
    });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
};

// @desc Login an admin
// @route /api/admin/auth/login
// @method POST
// @access Public
const loginAdmin = async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({
      success: false,
      message: "Username or Password is not provided",
    });
  }
  let { username, password } = req.body;
  username = username.toLowerCase();

  try {
    // check if the username exists in the database
    const admin = await Admin.findOne({ username });
    if (admin) {
      // check if password's match
      const passwordsMatch = await bcrypt.compare(password, admin.password);
      if (passwordsMatch) {
        // yay! that's really an admin. Let's give him/her a token they can use to make request for protected routes
        const token = generateToken({ id: admin.id });

        return res.status(200).json({
          success: true,
          data: { admin: { username: admin.username, token } },
        });
      }
      return res
        .status(401)
        .json({ success: false, message: "Incorrect Password" });
    }

    res.status(401).json({ success: false, message: "Admin does not exist" });
  } catch (err) {
    res
      .status(401)
      .json({ success: false, message: `Incorrect Username or password ${err}` });
  }
};

// @desc Get details of an admin
// @route /api/admin/auth/@me
// @method GET
// @access Private
const getMe = async (req, res) => {
  res.status(200).json({ success: true, data: { admin: req.admin } });
};



const signNewToken = async (req, res) => {
  const token = generateToken({ id: req.decodedToken.id })
  res.status(200).json({ success: true, data: { token } })
}



//export the controller functions here
module.exports = {
  registerAdmin,
  loginAdmin,
  getMe,
  signNewToken
};
