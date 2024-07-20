import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import UserModel from "../models/UserModel.js";
import JWT from "jsonwebtoken";
import { expressjwt } from "express-jwt";
import dotenv from 'dotenv';
dotenv.config();


// middleware
const requireSignIn = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
});


// register user

const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // validation
    if (!name) {
      return res.status(401).send({
        success: false,
        message: "name is required",
      });
    }
    if (!email) {
      return res.status(402).send({
        success: false,
        message: "email is required",
      });
    }
    if (!password || password.length < 6) {
      return res.status(403).send({
        success: false,
        message: "password is required and 6 character long",
      });
    }

    // existing user
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(501).send({
        success: false,
        message: "User Already Register with This Email",
      });
    }

    // Hash Password
    const hashedPassword = await hashPassword(password);

    // save user
    const user = await UserModel({
      name,
      email,
      password: hashedPassword,
    }).save();

    res.status(200).send({
      success: true,
      message: "Registration Successfully Please Login",
    });
  } catch (error) {
    console.log(error);
    return res.status(502).send({
      success: false,
      message: "Error in Register API",
      error,
    });
  }
};

// login user

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: "Please Provide Email Or Password",
      });
    }
    // find user
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(500).send({
        success: false,
        message: "User Not Found",
      });
    }
    //match password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(500).send({
        success: false,
        message: "Invalid usrname or password",
      });
    }

    //TOKEN JWT
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // undeinfed password
    user.password = undefined;
    res.status(200).send({
      success: true,
      message: "login successfully",
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "error in login api",
      error,
    });
  }
};

// update user
const updateUserController = async (req, res) => {
  try {
    const { name, password, email } = req.body;

    // user find
    const user = await UserModel.findOne({ email });

    // password validate
    if (password && password.length < 6) {
      return res.status(401).send({
        success: false,
        message: "Password is required and should be 6 character long",
      });
    }

    const hashedPassword = password ? await hashPassword(password) : undefined;

    // updated User
    const updatedUser = await UserModel.findOneAndUpdate(
      { email },
      {
        name: name || user.name,
        password: hashedPassword || user.password,
      },
      { new: true }
    );

    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Profile Updated Please Login",
      updatedUser,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error in User Update Api",
      error,
    });
  }
};

export { registerController, loginController, updateUserController,requireSignIn };
