const userModel = require("../models/userModel.js");
const bcrypt = require("bcryptjs");
//get user info
const getUserController = async (req, res) => {
  try {
    // find user
    const user = await userModel.findById({ _id: req.body.id });

    // validation
    if (!user) {
      return res.status(404).send({
        message: "User Not Found",
      });
    }

    // hide password
    user.password = undefined;
    res.status(200).send({
      message: "User Data get successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in Get User Api",
      error,
    });
  }
};

// update user
const updateUserController = async (req, res) => {
  try {
    //find user
    const user = await userModel.findById({
      _id: req.body.id,
    });

    //validation
    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    //update
    const { username, address, phone } = req.body;

    if (username) user.username = username;
    if (address) user.address = address;
    if (phone) user.phone = phone;

    await user.save();
    res.status(200).send({
      message: "User updated succesfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "error in update user api",
      error,
    });
  }
};

// reset password

const resetPasswordController = async (req, res) => {
  try {
    const { email, newPassword, answer } = req.body;

    //validation
    if (!email || !newPassword || !answer) {
      return res.status(500).send({
        message: "Please provide all the fields",
      });
    }

    const user = await userModel.findOne({ email, answer });
    // validation
    if (!user) {
      return res.status(500).send({
        message: "User not found or invalid answer",
      });
    }
    //hashing password
    var salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();
    res.status(200).send({
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "error in password reset api",
    });
  }
};

//delete profile account
const deleteAccountController = async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.body.id);
    return res.status(200).send({
      message: "Your account has been deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "error in delete profile api",
      error,
    });
  }
};

const deleteProfileController = async (req, res) => {
  try {
    const deletedUser = await userModel.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    return res.status(200).send({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "error in delete profile api",
      error,
    });
  }
};

module.exports = {
  getUserController,
  updateUserController,
  resetPasswordController,
  deleteAccountController,
  deleteProfileController,
};
