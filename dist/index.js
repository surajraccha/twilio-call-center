"use strict";

var http = require("http");
var path = require("path");
var express = require("express");
var bodyParser = require("body-parser");
var router = require("./src/router");

// Create Express webapp
var app = express();
app.use(express["static"](path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(router);

// Create http server and run it
var server = http.createServer(app);
var port = process.env.PORT || 3000;
server.listen(port, function () {
  console.log("Express server running on *:" + port);
});
