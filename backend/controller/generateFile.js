const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const dirCodes = path.join(__dirname, 'codes'); // D:\AlgoUniversity\AlgoUniversity-Dev\Application Online Compiler\backend\codes

if(!fs.existsSync(dirCodes)){
          fs.mkdirSync(dirCodes, { recursive:true });
}
const generateFile = (language, code) => {
          const jobId = uuid(); // cc104f51-df9e-4edc-8532-adb3aa008ac3
          const filename = `${jobId}.${language}`; // cc104f51-df9e-4edc-8532-adb3aa008ac3.java
          const filePath = path.join(dirCodes, filename); // D:\AlgoUniversity\AlgoUniversity-Dev\Application Online Compiler\backend\codes\cc104f51-df9e-4edc-8532-adb3aa008ac3.java
          fs.writeFileSync(filePath, code);
          // console.log(filePath);
          return filePath;
};

module.exports = {
          generateFile,
}