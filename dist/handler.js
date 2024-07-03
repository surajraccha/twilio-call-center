"use strict";

var VoiceResponse = require("twilio").twiml.VoiceResponse;
var AccessToken = require("twilio").jwt.AccessToken;
var VoiceGrant = AccessToken.VoiceGrant;
var nameGenerator = require("../name_generator");
var config = require("../config");
var identity;
exports.tokenGenerator = function tokenGenerator() {
  identity = nameGenerator();
  var accessToken = new AccessToken(config.accountSid, config.apiKey, config.apiSecret);
  accessToken.identity = identity;
  var grant = new VoiceGrant({
    outgoingApplicationSid: config.twimlAppSid,
    incomingAllow: true
  });
  accessToken.addGrant(grant);

  // Include identity and token in a JSON response
  return {
    identity: identity,
    token: accessToken.toJwt()
  };
};
exports.voiceResponse = function voiceResponse(requestBody) {
  var toNumberOrClientName = requestBody.To;
  var callerId = config.callerId;
  var twiml = new VoiceResponse();

  // If the request to the /voice endpoint is TO your Twilio Number, 
  // then it is an incoming call towards your Twilio.Device.
  if (toNumberOrClientName == callerId) {
    var dial = twiml.dial();

    // This will connect the caller with your Twilio.Device/client 
    dial.client(identity);
  } else if (requestBody.To) {
    // This is an outgoing call

    // set the callerId
    var _dial = twiml.dial({
      callerId: callerId
    });

    // Check if the 'To' parameter is a Phone Number or Client Name
    // in order to use the appropriate TwiML noun 
    var attr = isAValidPhoneNumber(toNumberOrClientName) ? "number" : "client";
    _dial[attr]({}, toNumberOrClientName);
  } else {
    twiml.say("Thanks for calling!");
  }
  return twiml.toString();
};

/**
 * Checks if the given value is valid as phone number
 * @param {Number|String} number
 * @return {Boolean}
 */
function isAValidPhoneNumber(number) {
  return /^[\d\+\-\(\) ]+$/.test(number);
}