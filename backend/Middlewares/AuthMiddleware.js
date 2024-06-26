const User = require('../models/User');
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.userVerification = (req, res) => {
  const token = req.cookies.token;
  // console.log(token);
  if (!token) {
    return res.status(400).json({ success: false });
  }
  jwt.verify(token, process.env.SECRET_KEY, async (err, data) => {
    if (err) {
      return res.status(400).json({ success: false });
    } else {
      const user = await User.findById(data.id);
      if(user) {
        const isAdmin = user.email === process.env.ADMIN_EMAIL;
        return res.json({ status: true, id: user._id, user: user.name, email: user.email, isAdmin });
      }
      else return res.json({ status: false, message: "Invalid User" });
    }
  });
};

module.exports.logout = (req, res) => {
          try{
                    res.clearCookie("token",{
                      sameSite: 'None',
                      secure: true,
                    });
                    res.status(200).send({
                              message: "You have successfully logged out!",
                              success: true,
                    });
          } catch(error){
                    console.log(error.message);
          }
}
