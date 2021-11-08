const fs = require('fs');
const readline = require('readline');
const path = require('path');
let filepath = path.resolve(__dirname, 'text.txt');

console.log('Hello! Enter your text:');
let rl = readline.createInterface(process.stdin, process.stdout);
rl.prompt();
rl.on('line', function(line) {
  if (line === 'exit') {
    rl.close();
    console.log('Exiting. Good luck and goodbye');
  }
  fs.appendFile(`${filepath}`, `${line}`, function(error){
    if(error) throw error;
  });
  rl.prompt();
}).on('close',function(){
  console.log('Exiting. Good luck and goodbye');
  process.exit(0);
});