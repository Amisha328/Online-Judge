const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const route = require('./routes/routing.js');
const bodyParser = require("body-parser");
const { DBConnection } = require("./database/db.js");

const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

/*
enable the express server to respond to preflight requests. 
A preflight request is basically an OPTION request sent to the server before the actual request is sent, 
in order to ask which origin and which request options the server accepts.
*/

app.use(
    cors({
      origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true,
    })
);



app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

DBConnection();

app.use('/', route);

require('./controller/cleanupScheduler.js');

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});