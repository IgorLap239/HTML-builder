const fs = require('fs');
const path = require('path');
const dirPath = path.resolve(__dirname, 'files');

fs.stat(`${__dirname}/files-copy`, function(err) {
  if(err == null) {
    fs.promises.readdir(`${__dirname}/files-copy`, { withFileTypes: true })
      .then ((files) => {
        files.forEach(file => {
          fs.unlink(`${__dirname}/files-copy/${file.name}`, err => {
            if (err) throw err;
          });
        });
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
  } else {
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
  }
});