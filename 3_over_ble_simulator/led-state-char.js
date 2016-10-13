var util = require('util');
var os = require('os');
var exec = require('child_process').exec;

var bleno = require('bleno');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var LedStateCharacteristic = function() {
  LedStateCharacteristic.super_.call(this, {
    uuid: '6811',
    properties: ['read', 'write'],
    _value: 0
  });
};

util.inherits(LedStateCharacteristic, Characteristic);

LedStateCharacteristic.prototype.onReadRequest = function(offset, callback) {
  callback(this.RESULT_SUCCESS, new Buffer([this._value]));
};
LedStateCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data[0];
  console.log('Led value is now', this._value ? 'on' : 'off');
  callback();
};

module.exports = LedStateCharacteristic;
