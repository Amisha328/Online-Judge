const { generateFile } = require("./generateFile.js")
const { executeFile } = require("./executeFile.js")
const { generateInputFile } = require("./generateInputFile.js")

exports.executeCode = async(req, res) => {
          const { language = 'cpp', code, input} = req.body;
          if(code == undefined) return res.status(404).json({success: false, error: "Empty code body"});
          
          try{
            const filePath = await generateFile(language, code);
            const inputPath = await generateInputFile(input);
            const output = await executeFile(language, filePath, inputPath);
            res.json({ filePath, inputPath, output });
              
              // return output;
          } catch(error){
                    res.status(500).json({ success: false, error: error});
          }
};
