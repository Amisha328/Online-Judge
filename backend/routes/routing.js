const express = require('express');
const routing = express.Router();
const controller = require('../controller/autheticate');

routing.post('/signup', controller.newUser);
routing.post('/login', controller.loginUser);
routing.all('*', controller.invalid);

module.exports = routing;
