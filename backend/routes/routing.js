const express = require('express');
const routing = express.Router();
const controller = require('../controller/autheticate');
const { userVerification, logout } = require('../Middlewares/AuthMiddleware');
const problemController = require('../controller/problemController');

routing.post('/signup', controller.newUser);
routing.post('/login', controller.loginUser);
routing.post('/verify-token', userVerification);
routing.post('/logout', logout);
routing.post('/request-password-reset', controller.requestPasswordReset);
routing.post('/reset-password/:id/:token', controller.resetPassword);
routing.get('/problems', problemController.getAllProblems);
routing.get('/problems/:id', problemController.getProblem);
routing.post('/problems/add', problemController.addProblem);
routing.put('/problems/:id', problemController.updateProblem);
routing.delete('/problems/:id',problemController.deleteProblem);
routing.all('*', controller.invalid);

module.exports = routing;
