const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require('crypto');

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
      // httpOnly: true,
      secure: true,
      sameSite: 'None',
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
      // httpOnly: true,
      secure: true,
      sameSite: 'None',
    };

   // send the token
    res.status(200).cookie("token", token, options).json({
      message: "You have successfully logged in!",
      success: true,
      token,
      user
    });


  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
    console.log(error.message);
  }
};

 // Forgot Password
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.send({status: false, message: "Email is required"});

  const user = await User.findOne({ email });
  if (!user) return res.send({status: false, message:"User with this email does not exist"});

  // const resetToken = crypto.randomBytes(32).toString("hex");
  // user.resetPasswordToken = resetToken;
  // user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  // await user.save();

  const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    to: email,
    from: process.env.EMAIL,
    subject: "Password Reset",
    text: `You are receiving this because you have requested the reset of the password for your account.\n\n
           Please click on the following link, or paste this into your browser to complete the process:\n
           ${process.env.FRONTEND_URL}/reset-password/${user._id}/${token}
           If you did not request this, please ignore this email and your password will remain unchanged.\n`,
  };

 
  transporter.sendMail(mailOptions, (err, response) => {
    if (err) {
      console.error("Error sending email:", err);
      return res.status(500).send("Error sending email");
    }
    res.status(200).send("Recovery email sent");
  });
};

//  Reset Password
exports.resetPassword = async (req, res) => {
  const { password } = req.body;
  const { id, token } = req.params;
  if (!token || !password) return res.status(400).send("Token and password are required");

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if(err) {
        return res.json({status: false, message: "Error with token"})
    } else {
        bcrypt.hash(password, 10)
        .then(hash => {
            User.findByIdAndUpdate({_id: id}, {password: hash})
            .then(u =>res.status(200).send("Password has been reset"))
            .catch(err => res.status(200).send(err))
        })
        .catch(err => res.status(200).send(err.message))
    }
})
};

exports.invalid = async (req, res) => {
          res.status(404).json({
            status: 'fail',
            message: 'Invalid path',
          });
};
