
var numLines = 0;
var pastNumLines = 0;

// Monitoring log report
require('fs').createReadStream(process.argv[2])
  .on('data', function(chunk) {
    for (var i=0; i < chunk.length; i++) {
      if (chunk[i] === 10) {
        numLines++;
      }
    };
    var rate = ((numLines - pastNumLines)/pastNumLines);
    if (rate === Infinity) {
      rate = 0;
    };
    console.log(`Number of lines: ${numLines}, Growth Rate: ${Math.round(rate * 100) / 100}`);
    pastNumLines += numLines
  })
  .on('end', function() {
    console.log('Process completed');
  });





