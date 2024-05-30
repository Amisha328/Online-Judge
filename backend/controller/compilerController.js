const { generateFile } = require("./generateFile.js")
const { executeFile } = require("./executeFile.js")

exports.executeCode = async(req, res) => {
          const { language = 'cpp', code} = req.body;
          if(code == undefined) return res.status(404).json({success: false, error: "Empty code body"});
          
          try{
              const filePath = await generateFile(language, code);
              const output = await executeFile(language, filePath);
              res.json({ filePath, output });
              
              // return output;
          } catch(error){
                    res.status(500).json({ success: false, error: error});
          }
};
