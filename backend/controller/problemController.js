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
/*
exports.getAllProblems = async (req, res) => {
  try {
    const { userId } = req.query;
    const problems = await Problem.find();

    const problemsWithStatus = problems.map(problem => {
      const accepted = problem.submissions.some(submission => submission.userId.toString() === userId && submission.verdict === 'Accepted');
      return { ...problem.toObject(), accepted };
    });

    res.status(200).json(problemsWithStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
*/


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
  try {
    const updatedProblem = await Problem.findByIdAndUpdate(id, {
      title, description, difficulty, tags, timeLimit, sampleTestCases, hiddenTestCases
    }, { new: true });
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
  try {
    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    const userSubmissions = problem.submissions.filter(submission => submission.userId.toString() === userId);
    res.json(userSubmissions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching submissions', error });
  }
};

exports.getTotalProblemsCount = async (req, res) => {
  try {
    const count = await Problem.countDocuments({});
    return res.status(200).json({ count });
  } catch (error) {
    console.error('Error fetching total problems count:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.getProblemChuncks = async(req, res) => {
  const { page, limit, userId } = req.query; // Get the page and limit from the query params

  try {
    const problems = await Problem.find()
      .skip((page - 1) * limit) // Skip problems from previous pages
      .limit(parseInt(limit)); // Limit the number of problems to be returned for the current page
    
      const problemsWithStatus = problems.map(problem => {
        const accepted = problem.submissions.some(submission => submission.userId.toString() === userId && submission.verdict === 'Accepted');
        return { ...problem.toObject(), accepted };
      });

    const totalProblems = await Problem.countDocuments(); // Count total problems in the database

    res.status(200).json({
      success: true,
      data: problemsWithStatus, // Send the problems for the current page
      totalPages: Math.ceil(totalProblems / limit), // Calculate total number of pages
      currentPage: parseInt(page), // Send the current page
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

exports.getFilteredProblems = async(req, res) => {
  try{
    const { difficulty, tag, search, userId, page, limit } = req.query;

    let filter = {};

    if(difficulty) filter.difficulty = difficulty;

    if(tag){
      filter.tags = { $regex: tag, $options: 'i' }; // Case-insensitive search for tags
    }

    /*
    The $or operator will search for problems where either the title or the tags field contains the search keyword.
    */
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },  // Case-insensitive search for title
        { tags: { $regex: search, $options: 'i' } }   // Case-insensitive search for tags
      ];
    }

    const skip = (page - 1) * limit;
    const problems = await Problem.find(filter).skip(skip).limit(parseInt(limit));
    const totalProblems = await Problem.countDocuments(filter);

    const problemsWithStatus = problems.map(problem => {
      const accepted = problem.submissions.some(submission => submission.userId.toString() === userId && submission.verdict === 'Accepted');
      return { ...problem.toObject(), accepted };
    }); 

    console.log("Final problem count: ",problemsWithStatus.length);

    res.status(200).json({
      problems: problemsWithStatus,
      currentPage: page,
      totalPages: Math.ceil(totalProblems / limit),
      totalProblems
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching problems', error });
  }
}