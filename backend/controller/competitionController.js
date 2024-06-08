const Competition = require('../models/Competition');

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
    console.log(contest);
    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }
    console.log(contest);
    res.json(contest.problems_included);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}
