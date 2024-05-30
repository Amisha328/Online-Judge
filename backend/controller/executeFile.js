const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const outputPath = path.join(__dirname, "outputs"); // D:\AlgoUniversity\AlgoUniversity-Dev\Application_Online_Compiler\backend\outputs

if (!fs.existsSync(outputPath)) {
  // if we do not use recursive:true it will throw an error if no directory exist at the specified path , but if we use recursive:true it will create a new directory instead of throwing error.
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeFile = (language, filePath) => {
  const jobId = path.basename(filePath).split(".")[0]; // 67123298-647e-421f-9f40-de80eb9856a6
  const outputFilename = `${jobId}.${getOutputExtension(language)}`;
  // D:\AlgoUniversity\AlgoUniversity-Dev\Application_Online_Compiler\backend\outputs\67123298-647e-421f-9f40-de80eb9856a6.exe
  const outPath = path.join(outputPath, outputFilename);
  
  // console.log(path.basename(outPath));
  
  // promise: manage asynchronous code
  return new Promise((resolve, reject) => {
    // for Linux and Mac - ./
    // for windows - .\\
      exec(getCommand(language, filePath, outPath), (error, stdout, stderr) => {
        if (error) {
          reject(error.message);
        } else if (stderr) {
          reject(stderr);
        } else {
          resolve(stdout);
        }
      });
    });
  //   exec(
  //     `g++ ${filePath} -o ${outPath} && cd ${outputPath} && .\\${outputFilename}`,
  //     (error, stdout, stderr) => {
  //       if (error) {
  //         reject(error);
  //       }
  //       if (stderr) {
  //         reject(stderr);
  //       }
  //       console.log("resolve");
  //       console.log(stdout);
  //       resolve(stdout);
  //     }
  //   );
  // });
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

const getCommand = (language, filePath, outPath) => {
  switch (language) {
    case "cpp":
      return `g++ ${filePath} -o ${outPath} && cd ${outputPath} && .\\${path.basename(outPath)}`;
    case "c":
      return `gcc ${filePath} -o ${outPath} && cd ${outputPath} && .\\${path.basename(outPath)}`;
    case "java":
      return `javac ${filePath} && java ${filePath}`;
    case "py":
      return `python ${filePath}`;
    default:
      throw new Error("Unsupported language");
  }
};

module.exports = {
  executeFile,
};

