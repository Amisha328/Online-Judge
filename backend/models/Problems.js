const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const problemSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, required: true },
  tags: { type: String },
  sampleTestCases: [
    {
      input: { type: String, required: true },
      expectedOutput: { type: String, required: true },
      explanation: { type: String }
    }
  ],
  submissions: [
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      verdict: { type: String, required: true },
      language: { type: String, required: true },
      submissionCode: { type: String, required: true },
      submissionTime: { type: Date, default: Date.now }
    }
  ]
});

// Create the Problem model
const Problem = mongoose.model('problem', problemSchema);
module.exports = Problem;
