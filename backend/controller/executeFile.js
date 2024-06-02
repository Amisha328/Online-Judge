const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const outputPath = path.join(__dirname, "outputs"); 

if (!fs.existsSync(outputPath)) {
  // if we do not use recursive:true it will throw an error if no directory exist at the specified path , but if we use recursive:true it will create a new directory instead of throwing error.
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeFile = (language, filePath, inputPath) => {
  const jobId = path.basename(filePath).split(".")[0]; 
  const outputFilename = `${jobId}.${getOutputExtension(language)}`;
  const outPath = path.join(outputPath, outputFilename);
  console.log(path.basename(outPath));
  
  // promise: manage asynchronous code
  return new Promise((resolve, reject) => {
    // for Linux and Mac - ./
    // for windows - .\\
      exec(getCommand(language, filePath, outPath, inputPath), (error, stdout, stderr) => {
        if (error) {
          reject(error.message);
        } else if (stderr) {
          reject(stderr);
        } else {
          resolve(stdout);
        }
      });
    });
};

const getOutputExtension = (language) => {
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
};

const getCommand = (language, filePath, outPath, inputPath) => {
  switch (language) {
    case "cpp":
      return `g++ ${filePath} -o ${outPath} && cd ${outputPath} && .\\${path.basename(outPath)} < ${inputPath}`;
    case "c":
      return `gcc ${filePath} -o ${outPath} && cd ${outputPath} && .\\${path.basename(outPath)} < ${inputPath}`;
    case "java":
      return `javac ${filePath} && java ${filePath} < ${inputPath} `;
    case "py":
      return `python ${filePath} < ${inputPath}`;
    default:
      throw new Error("Unsupported language");
  }
};

module.exports = {
  executeFile,
};

