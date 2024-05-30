const express = require('express');
const routing = express.Router();
const controller = require('../controller/autheticate');
const { userVerification, logout } = require('../Middlewares/AuthMiddleware');
const problemController = require('../controller/problemController');
const compilerController = require('../controller/compilerController');
const { isAdmin } = require("../Middlewares/AdminMiddleware.js");

routing.post('/signup', controller.newUser);
routing.post('/login', controller.loginUser);
routing.post('/verify-token', userVerification);
routing.post('/logout', logout);
routing.post('/request-password-reset', controller.requestPasswordReset);
routing.post('/reset-password/:id/:token', controller.resetPassword);
routing.get('/problems', problemController.getAllProblems);
routing.get('/problems/:id', problemController.getProblem);
routing.post('/problems/add', isAdmin, problemController.addProblem);
routing.put('/problems/:id', isAdmin, problemController.updateProblem);
routing.delete('/problems/:id',isAdmin, problemController.deleteProblem);
routing.post('/run', compilerController.executeCode);
routing.all('*', controller.invalid);

module.exports = routing;
