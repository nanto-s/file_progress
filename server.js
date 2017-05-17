/**
 * Created by User on 5/15/2017.
 */
"use strict";

let {Server} = require('http');
let server = new Server().listen(3000);

server.on ('request', require('./request'));

