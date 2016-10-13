var util = require('util');

var bleno = require('bleno');

var BlenoPrimaryService = bleno.PrimaryService;

var SensorStateChar = require('./sensor-state-char');

function SensorService() {
  var c = new SensorStateChar();
  SensorService.super_.call(this, {
      uuid: '6710',
      characteristics: [
          c
      ]
  });
  this.sensorState = c;
}

util.inherits(SensorService, BlenoPrimaryService);

module.exports = SensorService;
