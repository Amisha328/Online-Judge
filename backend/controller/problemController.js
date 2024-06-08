const Problem = require('../models/Problems.js');

// Add a new problem
exports.addProblem = async (req, res) => {
  const { title, description, difficulty, tags, timeLimit, sampleTestCases, hiddenTestCases } = req.body;

  try {
    const newProblem = new Problem({ title, description, difficulty, tags, timeLimit, sampleTestCases, hiddenTestCases });
    await newProblem.save();
    res.status(200).json({status: true, message: "Problem added successfully!"});
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get all problems
exports.getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find();
    res.status(200).json(problems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a problem 
exports.getProblem = async (req, res) => {
          let { id } = req.params;
          try {
            const problems = await Problem.findById(id);
            res.status(200).json(problems);
          } catch (error) {
            res.status(500).json({ message: error.message });
          }
};

// Update a problem
exports.updateProblem = async (req, res) => {
  const { id } = req.params;
  const { title, description, difficulty, tags, timeLimit, sampleTestCases, hiddenTestCases } = req.body;
  console.log("Inside Update")
  try {
    const updatedProblem = await Problem.findByIdAndUpdate(id, {
      title, description, difficulty, tags, timeLimit, sampleTestCases, hiddenTestCases
    }, { new: true });
     console.log(updatedProblem);
    if (!updatedProblem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    res.status(200).json({status: true, message: "Problem updated successfully!"});
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Delete a problem
exports.deleteProblem = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProblem = await Problem.findByIdAndDelete(id);

    if (!deletedProblem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    res.status(200).json({ message: 'Problem deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSubmissions = async (req, res) => {
  const { id, userId } = req.params;
  // console.log("problemID");
  // console.log(id);
  // console.log("user ID")
  // console.log(userId);
  try {
    const problem = await Problem.findById(id);
    console.log(problem);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    const userSubmissions = problem.submissions.filter(submission => submission.userId.toString() === userId);
    // console.log(userSubmissions);
    res.json(userSubmissions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching submissions', error });
  }
};
