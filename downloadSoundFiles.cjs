const fs = require('fs');
const http = require('https');

const download = (url, dest, cb) => {
    const file = fs.createWriteStream(dest);

    const request = http.get(url, (response) => {
        // check if response is success
        if (response.statusCode !== 200) {
            return cb('Response status was ' + response.statusCode);
        }

        response.pipe(file);
    });

    // close() is async, call cb after close completes
    file.on('finish', () => file.close(cb));

    // check for request error too
    request.on('error', (err) => {
        fs.unlink(dest, () => cb(err.message)); // delete the (partial) file and then return the error
    });

    file.on('error', (err) => { // Handle errors
        fs.unlink(dest, () => cb(err.message)); // delete the (partial) file and then return the error
    });
};

const files = [
  "clap.57a2cad4.mp3",
  "hatclosed.26dcf30f.mp3",
  "hatopen.2e44bf1a.mp3",
  "kick.4330fb78.mp3",
  "snare.9148c7c7.mp3",
  "tom1.1da98a6a.mp3",
  "tom2.1d7c01e3.mp3",
  "tom3.f90ca4b1.mp3",
  "tom4.3f8afb9a.mp3",
];
const baseUrl = "https://musiclab.chromeexperiments.com/Shared-Piano/";

for (let file of files) {
  console.log(baseUrl, file)
  download((baseUrl + file), 'public/patterns/'+file.split(".")[0]+'.mp3', (err) => {
    if (err) {
      console.log(err);
    } else {
        console.log('done');
    }
  });
}