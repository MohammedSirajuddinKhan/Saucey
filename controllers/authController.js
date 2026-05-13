const userModel = require("../models/userModel.js");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");

const buildAuthCookie = (token) => {
  const maxAge = 7 * 24 * 60 * 60;
  const cookieParts = [
    `bitemeToken=${token}`,
    "Path=/",
    `Max-Age=${maxAge}`,
    "SameSite=Lax",
    "HttpOnly",
  ];

  if (process.env.NODE_ENV === "production") {
    cookieParts.push("Secure");
  }

  return cookieParts.join("; ");
};

//REGISTER
const registerController = async (req, res) => {
  try {
    const { username, email, password, phone, address, answer } = req.body;

    //validation if all needed things are present
    if (!username || !email || !password || !phone || !address || !answer) {
      return res.status(500).send({
        message: "please provide all fields",
      });
    }

    // check if the user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(500).send({
        message: "Email already registered, please login",
      });
    }

    //password hashing
    var salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //creating a new user
    const newUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
      address,
      phone,
      answer,
    });
    res.status(201).send({
      message: "successfully registered",
      newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "error in register api",
    });
  }
};

// LOGIN
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    //validation
    if (!email || !password) {
      return res.status(500).send({
        message: "Please provide email or password",
      });
    }

    //check user
    const user = await userModel.findOne({
      email,
    });
    if (!user) {
      return res.status(404).send({
        message: "Password mismatch",
      });
    }

    // check user password OR compare user password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(500).send({
        message: "invalid credentials",
      });
    }
    //token generation
    const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.setHeader("Set-Cookie", buildAuthCookie(token));

    res.status(200).send({
      message: "Login Successfully",
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in login API",
      error,
    });
  }
};

const logoutController = async (req, res) => {
  try {
    res.setHeader(
      "Set-Cookie",
      "bitemeToken=; Path=/; Max-Age=0; SameSite=Lax",
    );
    return res.status(200).send({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in logout API",
      error,
    });
  }
};

module.exports = { registerController, loginController, logoutController };
