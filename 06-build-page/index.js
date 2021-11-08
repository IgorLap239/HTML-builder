const fs = require('fs');
const path = require('path');

fs.mkdir(`${__dirname}/project-dist`, { recursive: true }, (err) => {
  if (err) throw err;
});

fs.promises.readdir(__dirname, 
  { withFileTypes: true })
  .then ((files) => {
    files.forEach(file => {
      if (file.isFile()) {
        if (path.extname(`${__dirname}/${file.name}`) == '.html') {
          (async () => {
            let template = await fs.promises.readFile(`${__dirname}/${file.name}`, 'utf8');
            let pattArr = template.match(/\{\{.+\}\}/g);
            let checkArr = [];
            pattArr.forEach((e) => {
              let arr = e.split('');
              let tmp = [];
              arr.forEach(el => {
                if (el != '{' && el != '}')
                  tmp.push(el);
              });
              e = tmp.join('');
              checkArr.push(e);
            });
            let filenames = await fs.promises.readdir(`${__dirname}/components`, { withFileTypes: true });
            let filesArr = [];
            for (let filename of filenames) {
              if (filename.isFile()) {
                if (path.extname(`${__dirname}/components/${filename.name}`) == '.html') {
                  filesArr.push(filename.name.split('.')[0]);
                }
              }
            }
            let res = checkArr.filter(item => filesArr.includes(item));
            const toPromiseArr = (tmp, array) => {
              return array.map(elem => {
                return new Promise((res, ) => {
                  let filename = elem + '.html';
                  const reg = new RegExp(`\{\{${elem}\}\}`);
                  const cmpPath = path.resolve(`${__dirname}/components/${filename}`);
                  const read = fs.createReadStream(cmpPath);
                  let code = '';
                  read.addListener('data', data => {code += data;});
                  read.addListener('end', () => {
                    tmp = tmp.replace(tmp.match(reg), code);
                    res(tmp);
                  });
                });
              });
            };
            let promArr = toPromiseArr(template, res);
            Promise.all(promArr).then(value => {
              fs.promises.writeFile(`${__dirname}/project-dist/index.html`, value[value.length-1]);
            }, reason => {
              console.log(reason);
            });
          })();
        }
      } else {
        if (file.name == 'styles') {
          fs.stat(`${__dirname}/project-dist/style.css`, function(err) {
            if(err == null) {
              fs.promises.unlink(`${__dirname}/project-dist/style.css`)
                .then (() => {
                  const stylesDirPath = path.join(__dirname, '/styles');
                  fs.readdir(stylesDirPath, 
                    { withFileTypes: true },
                    (err, files) => {
                      if (err)
                        console.log(err);
                      else {
                        files.forEach(file => {
                          if (path.extname(`${stylesDirPath}/${file.name}`) == '.css') {
                            let stream = new fs.ReadStream(`${stylesDirPath}/${file.name}`);
                            stream.on('readable', function(){
                              let data = stream.read();
                              fs.appendFile(`${__dirname}/project-dist/style.css`, `${data}`, function(error){
                                if(error) throw error;
                              });
                              stream.close();
                            });
                          }
                        });
                      }
                    });
                });
            } else {
              const stylesDirPath = path.join(__dirname, '/styles');
              fs.readdir(stylesDirPath, 
                { withFileTypes: true },
                (err, files) => {
                  if (err)
                    console.log(err);
                  else {
                    files.forEach(file => {
                      if (path.extname(`${stylesDirPath}/${file.name}`) == '.css') {
                        let stream = new fs.ReadStream(`${stylesDirPath}/${file.name}`);
                        stream.on('readable', function(){
                          let data = stream.read();
                          fs.appendFile(`${__dirname}/project-dist/style.css`, `${data}`, function(error){
                            if(error) throw error;
                          });
                          stream.close();
                        });
                      }
                    });
                  }
                });
            }
          });
        } else if (file.name == 'assets') {
          fs.stat(`${__dirname}/project-dist/assets`, function(err) {
            if(err == null) {
              const recursiveDelete = (directory) => {
                fs.promises.readdir(directory, { withFileTypes: true })
                  .then ((files) => {
                    files.forEach(file => {
                      if (file.isFile()) {
                        fs.unlink(`${directory}/${file.name}`, err => {
                          if (err) throw err;
                        });
                      } else {
                        let dirPath = path.join(assetsDirPath, `/${file.name}`);
                        recursiveDelete(dirPath, file.name);
                      }
                    });
                  });
              };
              const assetsDirPath = path.join(__dirname, 'project-dist/assets');
              recursiveDelete(assetsDirPath);
            }
            fs.mkdir(`${__dirname}/project-dist/assets`, { recursive: true }, (err) => {
              if (err) throw err;
            });
            const recrsiveCopy = (directory, inDir = '') => {
              fs.readdir(directory, { withFileTypes: true }, (err, files) => {
                if (err)
                  console.log(err);
                else {
                  let copyPath = path.join(`${__dirname}/project-dist/assets`, `${inDir}`);
                  files.forEach(file => {
                    if (file.isFile()) {
                      fs.copyFile(`${directory}/${file.name}`, `${copyPath}/${file.name}`, (err) => {
                        if (err) {
                          console.log(err);
                        }
                      });
                    } else {
                      fs.mkdir(`${__dirname}/project-dist/assets/${file.name}`, { recursive: true }, (err) => {
                        if (err) throw err;
                      });
                      let dirPath = path.join(assetsDir, `/${file.name}`);
                      recrsiveCopy(dirPath, file.name);
                    }
                  });
                }
              });
            };
            const assetsDir = path.join(__dirname, '/assets');
            recrsiveCopy(assetsDir);
          });
        }
      }
    });
    
  });