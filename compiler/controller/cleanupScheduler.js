const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

const codesDir = path.join(__dirname, 'codes');
const inputsDir = path.join(__dirname, 'inputs');
const outputsDir = path.join(__dirname, 'outputs');

const deleteFilesOlderThan30Minutes = (dirPath) => {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    const now = new Date().getTime();
    const fileAge = (now - new Date(stats.mtime).getTime()) / (1000 * 60);

    if (fileAge > 30) {
      fs.unlinkSync(filePath);
      console.log(`Deleted ${filePath}`);
    }
  });
};

cron.schedule('*/30 * * * *', () => {
  console.log('Running file cleanup...');
  deleteFilesOlderThan30Minutes(codesDir);
  deleteFilesOlderThan30Minutes(inputsDir);
  deleteFilesOlderThan30Minutes(outputsDir);
});
