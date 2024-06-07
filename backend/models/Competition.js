const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const submissionSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  problem_id: { type: Schema.Types.ObjectId, ref: 'Problem', required: true },
  verdict: { type: String, enum: ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Compilation Error'], required: true },
  time_taken: { type: Number, required: true }, // in seconds
});

const leaderboardEntrySchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, default: 0 },
  problems_solved: { type: Number, default: 0 },
});

const competitionSchema = new Schema({
  title: { type: String, required: true },
  start_date_time: { type: Date, required: true },
  end_date_time: { type: Date, required: true },
  problems_included: [{ type: Schema.Types.ObjectId, ref: 'Problem' }],
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  submissions: [submissionSchema],
  leaderboard: [leaderboardEntrySchema],
});

module.exports = mongoose.model('competition', competitionSchema);
