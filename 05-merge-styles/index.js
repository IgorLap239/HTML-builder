const fs = require('fs');
const path = require('path');
const dirPath = path.resolve(__dirname, 'styles');

fs.readdir(dirPath, 
  { withFileTypes: true },
  (err, files) => {
    if (err)
      console.log(err);
    else {
      fs.stat(`${__dirname}/project-dist/bundle.css`, function(err) {
        if(err == null) {
          fs.unlinkSync(`${__dirname}/project-dist/bundle.css`);
        }
      });
      files.forEach(file => {
        if (file.isFile()) {
          if (path.extname(`${dirPath}/${file.name}`) == '.css') {
            let stream = new fs.ReadStream(`${dirPath}/${file.name}`);
            stream.on('readable', function(){
              let data = stream.read();
              fs.appendFile(`${__dirname}/project-dist/bundle.css`, `${data}`, function(error){
                if(error) throw error;
              });
              stream.close();
            });
          }
        }
      });
    }
  });