const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const dirInputs = path.join(__dirname, 'inputs');

if(!fs.existsSync(dirInputs)){
          fs.mkdirSync(dirInputs, { recursive:true });
}
const generateInputFile = async (input) => {
          const jobId = uuid();
          const inputFileName = `${jobId}.txt`;
          const inputFilePath = path.join(dirInputs, inputFileName);
          await fs.writeFileSync(inputFilePath, input);
          // console.log(inputFilePath);
          return inputFilePath;
};

module.exports = {
          generateInputFile,
}