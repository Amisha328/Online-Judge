const mongoose = require('mongoose');
const Competition = require('../models/Competition');
const User = require('../models/User')

exports.currentContest = async (req, res) => {
  const now = new Date();
  try {
    const competitions = await Competition.find({
      start_date_time: { $lte: now },
      end_date_time: { $gte: now }
    });
    res.json(competitions);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.upcomingContest = async (req, res) => {
  const now = new Date();
  try {
    const competitions = await Competition.find({
      start_date_time: { $gt: now }
    });
    res.json(competitions);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.pastContest = async (req, res) => {
  const now = new Date();
  const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
  try {
    const competitions = await Competition.find({
      end_date_time: { $lt: now, $gte: tenDaysAgo }
    });
    res.json(competitions);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.createContest = async(req, res) => {
    const { title, start_date_time, end_date_time, problems_included } = req.body;
    try {
        const newCompetition = new Competition({
            title,
            start_date_time: new Date(start_date_time),
            end_date_time: new Date(end_date_time),
            problems_included,
            participants: [],
            submissions: [],
            leaderboard: []
        });
        await newCompetition.save();
        res.status(201).json({status: true, message:"Contest hosted successfully!!"});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.getProblems = async(req, res) => {
  try {
    // console.log(req.params.contestId);
    const contest = await Competition.findById(req.params.contestId);
    // console.log(contest);
    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }
    // console.log(contest);
    res.json(contest.problems_included);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}

exports.cancelContest = async (req, res) => {
  const { contestId } = req.params;

  try {
    const competition = await Competition.findById(contestId);

    if (!competition) {
      return res.status(404).json({ error: 'Contest not found' });
    }

    // Ensure that only upcoming contests can be canceled
    if (new Date(competition.start_date_time) <= new Date()) {
      return res.status(400).json({ error: 'Only upcoming contests can be canceled' });
    }

    // Delete the contest
    await Competition.findByIdAndDelete(contestId);

    res.status(200).json({ message: 'Contest canceled successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error', error });
  }
};


const updateLeaderboard = async (contestId) => {
  try {
    const competition = await Competition.findById(contestId);
    // console.log("Inside Update Leaderboard");
    if (!competition) {
      // console.error('Competition not found');
      return;
    }

    const leaderboard = {};

    // Iterate over submissions to calculate scores and time
    for (const submission of competition.submissions) {
      const userId = submission.user_id._id.toString();
      // const user = submission.user_id;
      const user = await User.findById(userId);

      if (!leaderboard[userId]) {
        leaderboard[userId] = {
          user_id: user._id,
          name: user.name,
          problems_solved: 0,
          language: submission.language,
          total_time: 0,
          score: 0,
        };
      }

      if (submission.verdict === 'Accepted') {
        leaderboard[userId].problems_solved += 1;
        leaderboard[userId].total_time += (new Date(submission.submissionTime) - competition.start_date_time) / 1000; // Time in seconds
        leaderboard[userId].score += 10; 
      }
    }

    competition.leaderboard = Object.values(leaderboard);
    competition.leaderboard.sort((a, b) => {
      if (b.score === a.score) {
        return a.total_time - b.total_time;
      }
      return b.score - a.score;
    });

    await competition.save();
  } catch (error) {
    console.error('Error updating leaderboard:', error);
  }
};

exports.getLeaderboard = async (req, res) => {
  const { contestId } = req.params;
  await updateLeaderboard(contestId); // Ensure the leaderboard is updated before fetching it
  try {
    const competition = await Competition.findById(contestId);
    if (!competition) {
      return res.status(404).json({ error: 'Competition not found' });
    }

    res.status(200).json(competition.leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getCompetitionSubmissions = async (req, res) => {
  const { problemId, userId, contestId } = req.params;

  try {
    const competition = await Competition.findById(contestId);

    if (!competition) {
      return res.status(404).json({ error: 'Competition not found' });
    }

    const submissions = competition.submissions.filter(submission => 
      submission.problem_id._id.toString() === problemId && 
      submission.user_id._id.toString() === userId
    );

    res.status(200).json(submissions);
  } catch (error) {
    console.error('Error fetching competition submissions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};