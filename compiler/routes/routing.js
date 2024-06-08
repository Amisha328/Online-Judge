const express = require('express');
const routing = express.Router();
const compilerController = require('../controller/compilerController');

routing.post('/run', compilerController.executeCode);
routing.post('/submit', compilerController.submitCode);

module.exports = routing;
