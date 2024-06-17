const User = require('../models/User')
const Competition = require('../models/Competition');
const Problem = require('../models/Problems');

exports.getUserProfile = async (req, res) => {
          try {
                    const user = await User.findById(req.params.userId);
                    if (!user) {
                      return res.status(404).json({ error: 'User not found' });
                    }
                
                    const competitions = await Competition.find({ 'submissions.user_id': req.params.userId });
                    const problemsSolved = [];
                
                    for (const competition of competitions) {
                      for (const submission of competition.submissions) {
                        if (submission.user_id.toString() === req.params.userId && submission.verdict === 'Accepted') {
                          const problem = await Problem.findById(submission.problem_id);
                          if (problem) {
                            problemsSolved.push({
                              problemDetails: {
                                title: problem.title,
                                tags: problem.tags,
                                difficulty: problem.difficulty,
                              },
                              submissionTime: submission.submissionTime,
                            });
                          }
                        }
                      }
                    }
                    // console.log(user);
                    // console.log(problemsSolved);
                    res.status(200).json({ user , problemsSolved });
          } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
          }
        };