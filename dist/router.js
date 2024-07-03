"use strict";

var Router = require("express").Router;
var _require = require("./handler"),
  tokenGenerator = _require.tokenGenerator,
  voiceResponse = _require.voiceResponse;
var router = new Router();
router.get("/token", function (req, res) {
  res.send(tokenGenerator());
});
router.post("/voice", function (req, res) {
  res.set("Content-Type", "text/xml");
  res.send(voiceResponse(req.body));
});
module.exports = router;