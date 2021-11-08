const fs = require('fs');
 
const path = require('path');
const filepath = path.resolve(__dirname, 'text.txt');
let stream = new fs.ReadStream(filepath);
 
stream.on('readable', function(){
  let data = stream.read();
  console.log(data.toString());
  stream.close();
});
