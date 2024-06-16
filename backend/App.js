const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const route = require('./routes/routing.js');
const bodyParser = require("body-parser");
const { DBConnection } = require("./database/db.js");

const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/*
enable the express server to respond to preflight requests. 
A preflight request is basically an OPTION request sent to the server before the actual request is sent, 
in order to ask which origin and which request options the server accepts.
*/

// http://localhost:5173
// https://online-judge-zeta.vercel.app
app.use(
    cors({
      origin: ["http://localhost:5173"],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    })
);


// middlewares
// app.use(cors())
app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

DBConnection();


app.use('/', route);


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});