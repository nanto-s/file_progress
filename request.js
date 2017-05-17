/**
 * Created by User on 5/15/2017.
 */
"use strict";

let url = require('url');
let fs = require('fs');
let path = require('path');
let config = require('./config/param');
const mime = require('mime');


module.exports = ((req, res) => {

    let pathname = decodeURI(url.parse(req.url).pathname);
    let pathFiles = path.normalize(path.join(config.FILES, pathname.slice(1)));

    if (req.method === 'GET') {
        if (pathname === '/') {
            sendFile(`${config.ROOT}/index.html`, res);
        } else {
            sendFile(pathFiles, res);
        }
    }
    if (req.method === 'POST') {
        console.log('POST pathname '+pathname);
        let nf = fs.createWriteStream(pathFiles);
        req.pipe(nf);
        req.on('end', () => {res.end ('Uploaded!');});
    }
});


function sendFile(fileName, res) {
    let fileStream = fs.createReadStream(fileName);
      fileStream.pipe(res);

    fileStream
    .on('open', () => {
            res.setHeader('Content-Type', mime.lookup(fileName));
            console.log( '***'+mime.lookup(fileName));
      fileStream.pipe(res);
        })

        .on('error', function() {
            res.statusCode = 500;
            res.end("Server error");
        })
        .on('close', function() {
            fileStream.destroy();
        });

}
