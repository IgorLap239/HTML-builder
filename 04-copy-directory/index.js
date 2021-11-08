const fs = require('fs');
const path = require('path');
const dirPath = path.resolve(__dirname, 'files');

fs.mkdir(`${__dirname}/files-copy`, { recursive: true }, (err) => {
  if (err) throw err;
});

fs.readdir(dirPath, 
  { withFileTypes: true },
  (err, files) => {
    if (err)
      console.log(err);
    else {
      const copyPath = path.join(__dirname, '/files-copy');
      files.forEach(file => {
        if (file.isFile()) {
          fs.copyFile(`${dirPath}/${file.name}`, `${copyPath}/${file.name}`, (err) => {
            if (err) {
              console.log(err);
            }
          });
        }
      });
    }
  });