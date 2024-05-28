const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.newUser = async (req, res) => {
  try {
    //get all the data from body
    const { name, phoneNo, email, password } = req.body;

    // check that all the data should exists
    if (!(name && phoneNo && email && password)) {
      return res.status(400).send("Please enter all the information");
    }

    // Check if user already exists by email
    const existingUserByEmail = await User.findOne({ email });

    if (existingUserByEmail) {
      return res.status(400).send("Email already exists!");
    }

    // Check if user already exists by phone number
    const existingUserByPhone = await User.findOne({ phoneNo });
    if (existingUserByPhone) {
      return res.status(400).send("Phone number already exists!");
    }

    // encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // save the user in DB
    const user = await User.create({
      name,
      phoneNo,
      email,
      password: hashedPassword,
    });

    console.log("User created in database");
    // generate a token for user and send it
    const token = jwt.sign({ id: user._id, email }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    user.token = token;
    user.password = undefined;

    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: true,
    });

    res.status(200).json({ message: "You have successfully registered!", user });
  } 
  catch (error) {
    console.log(error);
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    // get all the data from the frontend
    const { email, password } = req.body;

    // check that all the data should exist
    if (!(email && password)) {
      return res.status(400).send("Please enter all the fields");
    }

    // find the user in the db
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({
        "message":"User not found",
      });
    }

    const enteredPassword = await bcrypt.compare(password, user.password);
    if (!enteredPassword) {
      return res.status(400).send({
        "message":"Password incorrect",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    user.token = token;
    user.password = undefined;

    const options = {
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

   // send the token
    res.status(200).cookie("token", token, options).json({
      message: "You have successfully logged in!",
      success: true,
      token,
    });


  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
    console.log(error.message);
  }
};

exports.invalid = async (req, res) => {
          res.status(404).json({
            status: 'fail',
            message: 'Invalid path',
          });
};
