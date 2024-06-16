const express = require('express');
const routing = express.Router();
const controller = require('../controller/autheticate');
const { userVerification, logout } = require('../Middlewares/AuthMiddleware');
const problemController = require('../controller/problemController');
const { isAdmin } = require("../Middlewares/AdminMiddleware.js");
const contestController = require("../controller/competitionController.js");
const userController = require("../controller/userController.js")

routing.post('/signup', controller.newUser);
routing.post('/login', controller.loginUser);
routing.post('/verify-token', userVerification);
routing.post('/logout', logout);
routing.post('/request-password-reset', controller.requestPasswordReset);
routing.post('/reset-password/:id/:token', controller.resetPassword);
routing.get('/problems', problemController.getAllProblems);
routing.get('/problems/:id', problemController.getProblem);
routing.get('/problems/submissions/:id/:userId', problemController.getSubmissions);
routing.post('/problems/add', problemController.addProblem);
routing.put('/problems/:id', problemController.updateProblem);
routing.delete('/problems/:id', problemController.deleteProblem);
routing.get('/contests/:contestId', contestController.getProblems)
routing.get('/current', contestController.currentContest);
routing.get('/upcoming', contestController.upcomingContest);
routing.get('/past', contestController.pastContest);
routing.post('/create-contest', contestController.createContest);
routing.get('/competition/submissions/:problemId/:userId/:contestId', contestController.getCompetitionSubmissions);
routing.get('/competitions/:contestId/leaderboard', contestController.getLeaderboard);
routing.get('/:userId/profile', userController.getUserProfile);
routing.all('*', controller.invalid);

module.exports = routing;
