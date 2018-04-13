var fs = require('fs');

// FIRST STREAM - Read data from text file
var firstReadStream = fs.createReadStream('myData.txt');
var firstWriteStream = fs.createWriteStream('output.txt');

var numLines = 0;
var dataLength = 0;

firstReadStream
  .on('data', (chunk) => {
    var hrstart = process.hrtime();
    numLines += chunk //Count number of lines
      .toString('utf8')
      .split('\n')
      .length - 1;
    dataLength += chunk.byteLength; //Calculate length in bytes
    var arr = []
    hrend = process.hrtime(hrstart); // Calculate time elapsed
    var endTime = hrend[1]/1000000
    arr.push({
      ElapsedTime: endTime,
      NumberOfLines: numLines,
      Length: dataLength
    });
    console.log(arr);
    // Output text
    firstWriteStream.write(JSON.stringify(arr));
  })
  .on('end', () => {
    console.log('Process completed')
  });

// SECOND STREAM - Generate Report
var delayInMilliseconds = 1000;
setTimeout( () => {
  var secondReadStream = fs.createReadStream('output.txt');
  var secondWriteStream = fs.createWriteStream('report.txt');

  secondReadStream
    .on('data', (chunk) => {
      var str = chunk.toString('utf8').split('][');
      var arr = JSON.parse(str);

      for (var i = 0; i < arr.length; i++) {
        var item = arr[i];
        var rate = item.Length/(item.ElapsedTime * .001);//Throughput rate in bytes per sec
        var report = `STREAM PERFORMANCE: Time elapsed (ms): ${item.ElapsedTime}, Number of lines received: ${item.NumberOfLines}, Length (bytes): ${item.Length}, Throughput Rate (bytes/sec): ${rate} \n`
        console.log(report);
        secondWriteStream.write(report);
      };
    })
    .on('end', () => {
      console.log('Process completed');
    });
}, delayInMilliseconds);





