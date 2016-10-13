var util = require('util');

var bleno = require('bleno');

var BlenoPrimaryService = bleno.PrimaryService;

var LedStateChar = require('./led-state-char');

function LedService() {
  LedService.super_.call(this, {
      uuid: '6810',
      characteristics: [
          new LedStateChar()
      ]
  });
}

util.inherits(LedService, BlenoPrimaryService);

module.exports = LedService;
