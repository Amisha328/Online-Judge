const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
{
          name:{
                    type: String,
                    default: null,
                    required: [true, 'Required field'],
          },
          phoneNo:{
                    type: String,
                    default: null,
                    unique: true,
                    required: true,
          },
          email:{
                    type: String,
                    default: null,
                    unique: true,
                    required: true,
          },
          password:{
                    type: String,
                    required: true,
          }
},
        {
          timestamps: {
            createdAt: true,
            updatedAt: true,
          },
        }
);

// Create Model
module.exports = mongoose.model("user", userSchema); // user name of database
