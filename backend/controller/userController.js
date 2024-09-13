const User = require('../models/User')
const Competition = require('../models/Competition');
const Problem = require('../models/Problems');

exports.getUserProfile = async (req, res) => {
  try {
    // console.log("Fetching user with ID:", req.params.userId);
    const user = await User.findById(req.params.userId);
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: 'User not found' });
    }

    // console.log("User found:", user);

    // Fetch competition problems solved
    const competitions = await Competition.find({ 'submissions.user_id': req.params.userId });
    // console.log("Competitions found:", competitions);

    const competitionProblemsSolved = [];

    for (const competition of competitions) {
      for (const submission of competition.submissions) {
        if (submission.user_id.toString() === req.params.userId && submission.verdict === 'Accepted') {
          const problem = await Problem.findById(submission.problem_id);
          if (problem) {
            competitionProblemsSolved.push({
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

    // Fetch practice problems solved
    const practiceProblems = await Problem.find({
      'submissions.userId': req.params.userId,
      'submissions.verdict': 'Accepted'
    });


    let countProblemsSolved = 0;

    for (const practice of practiceProblems) {
      for(const submission of practice.submissions){
        if (submission.userId.toString() === req.params.userId && submission.verdict === 'Accepted') 
          countProblemsSolved++;
      }
    }


    res.status(200).json({ user, competitionProblemsSolved, countProblemsSolved });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateUser = async (req, res) => {
  const { userId } = req.params;
  const { email, phoneNo } = req.body;

  try {
    const updatedProfile = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          email: email,
          phoneNo: phoneNo,
        },
      },
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: 'User not found' });
    }

    // console.log('Updated Profile:', updatedProfile);

    res.status(200).json({ status: true, message: 'User updated successfully!', user: updatedProfile });
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).json({ status: false, message: error.message });
  }
};

