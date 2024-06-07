const { generateFile } = require("./generateFile.js");
const { executeFile, executeCompiledFile } = require("./executeFile.js");
const { generateInputFile } = require("./generateInputFile.js");
const Problem = require("../models/Problems.js");
const fs = require("fs");
const path = require("path");

exports.executeCode = async (req, res) => {
  const { language = 'cpp', code, input } = req.body;

  if (code == undefined) return res.status(404).json({ success: false, error: "Empty code body" });

  try {
    const filePath = await generateFile(language, code);
    const inputPath = await generateInputFile(input);
    const output = await executeFile(language, filePath, inputPath);
    res.json({ filePath, inputPath, output });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};

exports.submitCode = async (req, res) => {
  const { userId, language = 'cpp', code, problemId, timeLimt } = req.body;
  if (!code) return res.status(404).json({ success: false, error: "Empty code body" });
  try {
    // Fetch hidden test cases from the database
    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ success: false, error: "Problem not found" });

    const hiddenTestCases = problem.hiddenTestCases;

  
    const { input, expectedOutput } = hiddenTestCases[0];
    const filePath = await generateFile(language, code);
    const inputPath = await generateInputFile(input);
    const jobId = path.basename(filePath).split(".")[0];
    const outputPath = path.join(__dirname, "outputs", `${jobId}.${getOutputExtension(language)}`);

    try{
      const output = await executeFile(language, filePath, inputPath, timeLimt);
      // console.log("output", output);
      if (output.trim() !== expectedOutput.trim()) {
       saveSubmission(problem, userId, "Wrong Answer on Test Case 1", language, code);
        return res.json({
          verdict: "Wrong Answer on Test Case 1",
          status: false,
          input,
          expectedOutput,
          output
        });
    }
   } catch(error){
   saveSubmission(problem, userId, "Runtime Error", language, code);
    return res.json({
      verdict: error.message,
      status: false,
      error: error.message
    });
   }

    for (let i = 1; i < hiddenTestCases.length; i++) {
      const { input, expectedOutput } = hiddenTestCases[i];
      await fs.writeFileSync(inputPath, input);
      console.log(input);

      try {
        const output = await executeCompiledFile(language, filePath, outputPath, inputPath, timeLimt);
        // console.log("Inside Output")
        // console.log(output);
        if (output.trim() !== expectedOutput.trim()) {
         saveSubmission(problem, userId, `Wrong Answer on Test Case ${i + 1}`, language, code);
          return res.json({
            verdict: `Wrong Answer on Test Case ${i + 1}`,
            status: false,
            input,
            expectedOutput,
            output
          });
        }
      } catch (error) {
       saveSubmission(problem, userId, `Runtime Error on Test Case ${i + 1}`, language, code);
        return res.json({
          verdict: `Runtime Error on Test Case ${i + 1}`,
          status: false,
          error: error.message
        });
      }
    }
    
    saveSubmission(problem, userId, "Accepted", language, code);
    return res.json({
      status: true,
      verdict: "Accepted"
    });


  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


const saveSubmission = async (problem, userId, verdict, language, code) => {
  const newSubmission = {
    userId,
    verdict,
    language,
    submissionCode: code,
    submissionTime: new Date()
  };

  // Add the new submission to the submissions array
  problem.submissions.push(newSubmission);

  // If the submissions array length exceeds 5, remove the oldest submission
  if (problem.submissions.length > 5) {
    problem.submissions.shift();
  }

  // Save the updated problem document
  await problem.save();
}

const getOutputExtension = (language) => {
  switch (language) {
    case "cpp":
    case "c":
      return "exe";
    case "java":
      return "class";
    case "py":
      return "py";
    default:
      throw new Error("Unsupported language");
  }
};
