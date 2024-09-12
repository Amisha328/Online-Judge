const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeFile = (language, filePath, inputPath, timeLimt) => {
  const jobId = path.basename(filePath).split(".")[0];
  const outputFilename = `${jobId}.${getOutputExtension(language)}`;
  const outPath = path.join(outputPath, outputFilename);

  return new Promise((resolve, reject) => {
    exec(getCompileCommand(language, filePath, outPath, inputPath), (error, stdout, stderr) => {
      if (error) {
        reject({
          type: 'Compilation Error',
          message: error.message,
          code: error.code, 
        });
      } else if (stderr) {
        reject({
          type: 'Runtime Error',
          message: stderr, // Runtime error message
        });
      } else {
        const runProcess = exec(getRunCommand(language, filePath, outPath, inputPath), (error, stdout, stderr) => {
          if (error) {
            reject({
              type: 'Compilation Error',
              message: error.message,
              code: error.code, 
            });
          } else if (stderr) {
            reject({
              type: 'Runtime Error',
              message: stderr, // Runtime error message
            });
          } else {
            resolve(stdout);
          }
        });

        // Enforce the time limit
        const timer = setTimeout(() => {
          runProcess.kill('SIGKILL');
          reject({
            type: 'Time Limit Exceeded',
            message: 'The process exceeded the allowed time limit.',
          });
        }, timeLimt);
      }
    });
  });
};

const executeCompiledFile = (language, filePath, outPath, inputPath, timeLimt) => {
  return new Promise((resolve, reject) => {
    const runProcess = exec(getRunCommand(language, filePath, outPath, inputPath), (error, stdout, stderr) => {
      if (error) {
        reject({
          type: 'Runtime Error',
          message: stderr, // Runtime error message
        });
      } else if (stderr) {
        reject({
          type: 'Runtime Error',
          message: stderr, // Runtime error message
        });
      } else {
        resolve(stdout);
      }
    });

     // Enforce the time limit
     const timer = setTimeout(() => {
      runProcess.kill('SIGKILL');
      reject({
        type: 'Time Limit Exceeded',
        message: 'The process exceeded the allowed time limit.',
      });
    }, timeLimt);

  });
};

const getOutputExtension = (language) => {
  /*

  // For Windows
  switch (language) {
    case "cpp":
      return "exe";
    case "c":
      return "exe";
    case "java":
      return "class";
    case "py":
      return "py";
    default:
      throw new Error("Unsupported language");
  }
  */

  // For Linux

  switch (language) {
    case 'cpp':
      return 'out';
    case 'c':
      return 'out';
    case 'java':
      return 'class';
    case 'py':
      return 'py';
    default:
      throw new Error('Unsupported language');
  }

};

const getCompileCommand = (language, filePath, outPath, inputPath) => {
  switch (language) {
    case "cpp":
      return `g++ ${filePath} -o ${outPath}`;
    case "c":
      return `gcc ${filePath} -o ${outPath}`;
    case "java":
      return `javac ${filePath}`;
    case "py":
      return `python ${filePath} < ${inputPath}`;
    default:
      throw new Error("Unsupported language");
  }
};

const getRunCommand = (language, filePath, outPath, inputPath) => {
  /*
  switch (language) {
    case "cpp":
      return `cd ${outputPath} && .\\${path.basename(outPath)} < ${inputPath}`;
    case "c":
      return `cd ${outputPath} && .\\${path.basename(outPath)} < ${inputPath}`;
    case "java":
      return `java ${filePath} < ${inputPath}`;
    case "py":
      return `python ${filePath} < ${inputPath}`;
    default:
      throw new Error("Unsupported language");
  }
  */

  switch (language) {
    case "cpp":
      return `cd ${outputPath} && ./${path.basename(outPath)} < ${inputPath}`;
    case "c":
      return `cd ${outputPath} && ./${path.basename(outPath)} < ${inputPath}`;
    case "java":
      return `java ${filePath} < ${inputPath}`;
    case "py":
      return `python ${filePath} < ${inputPath}`;
    default:
      throw new Error("Unsupported language");
  }
};

module.exports = {
  executeFile,
  executeCompiledFile,
};
