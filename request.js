/**
 * Created by User on 5/15/2017.
 */
"use strict";

let url = require('url');
let fs = require('fs');
let path = require('path');
let config = require('./config/param');
//let config = require('config');
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
        console.log('POST pathname ' + pathname);
        let nf = fs.createWriteStream(pathFiles);
        req.pipe(nf);
        req.on('end', () => {
            res.end('Uploaded!');
        });
    }
});


function sendFile(fileName, res) {
    let fileStream = fs.createReadStream(fileName);
    fileStream.pipe(res);
    fileStream
        .on('error', err => {
            if (err.code === 'ENOENT'){
                res.statusCode = 404;
                res.end(`File not found!`);
            } else {
                res.statusCode = 500;
                res.end(`Server error`);
                console.error(err);
            }
        })
        .on('open', () => {
            res.setHeader('Content-Type', mime.lookup(fileName));
        })
        .on('close', function () {
            fileStream.destroy();
        });
        res.on('close', () => {
            fileStream.destroy();
        });
}
