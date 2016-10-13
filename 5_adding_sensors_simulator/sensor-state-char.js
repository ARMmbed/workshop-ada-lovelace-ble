var util = require('util');
var os = require('os');
var exec = require('child_process').exec;

var bleno = require('bleno');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var SensorStateChar = function() {
  SensorStateChar.super_.call(this, {
    uuid: '6711',
    properties: ['read', 'notify'],
  });

  this._value = 21; /* means 21.0..21.5 degrees */
};

util.inherits(SensorStateChar, Characteristic);

SensorStateChar.prototype.formatValue = function(temp) {
  var t = Math.round(temp * 100);
  return new Buffer([ t & 0xff, t >> 8, 0x00, 0x00 ]);
};

SensorStateChar.prototype.onReadRequest = function(offset, callback) {
  callback(this.RESULT_SUCCESS, this.formatValue(this._value));
};
SensorStateChar.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('Subscribed to sensor events');

  clearInterval(this._uvcIv);

  this._uvcIv = setInterval(function() {
    // between this._value and this._value + 0.5
    var temp = this._value + (Math.random() * 0.5);
    console.log('Temperature is', temp.toFixed(2));
    // format it in four bytes (uint32)
    updateValueCallback(this.formatValue(temp));
  }.bind(this), 2000);
};
SensorStateChar.prototype.onUnsubscribe = function() {
  this._uvcIv && console.log('Unsubscribed to sensor events');

  clearInterval(this._uvcIv);
};
SensorStateChar.prototype.up = function() {
  this._value += 0.5;

  console.log('[UP] Temperature is now floating between %d and %d degrees', this._value, this._value + 0.5);
};
SensorStateChar.prototype.down = function() {
  this._value -= 0.5;

  console.log('[DOWN] Temperature is now floating between %d and %d degrees', this._value, this._value + 0.5);
};

module.exports = SensorStateChar;
