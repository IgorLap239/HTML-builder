const fs = require('fs');
const path = require('path');
let dirPath = path.resolve(__dirname, 'secret-folder');

fs.readdir(dirPath, 
  { withFileTypes: true },
  (err, files) => {
    if (err)
      console.log(err);
    else {
      files.forEach(file => {
        if (file.isFile()) {
          let filePath = path.join(dirPath, `${file.name}`);
          fs.stat(filePath, (error, stats) => {
            if (error) {
              console.log(error);
            }
            else {
              let index = file.name.lastIndexOf('.');
              let fileName = file.name.slice(0, index);
              let fileExt = file.name.slice(index+1, file.name.length);
              console.log(`${fileName} - ${fileExt} - ${stats.size/1000}kb`);
            }
          });
        }
      });
    }
  });