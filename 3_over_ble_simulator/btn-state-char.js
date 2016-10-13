var util = require('util');
var os = require('os');
var exec = require('child_process').exec;

var bleno = require('bleno');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var BtnStateChar = function() {
  BtnStateChar.super_.call(this, {
    uuid: '6911',
    properties: ['read', 'notify'],
    _value: 0
  });
};

util.inherits(BtnStateChar, Characteristic);

BtnStateChar.prototype.onReadRequest = function(offset, callback) {
  callback(this.RESULT_SUCCESS, new Buffer([this._value]));
};
BtnStateChar.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('Subscribed to button events');

  this._uvc = updateValueCallback;
};
BtnStateChar.prototype.onUnsubscribe = function() {
  this._uvc && console.log('Unsubscribed to button events');

  this._uvc = null;
};
BtnStateChar.prototype.setValue = function(v) {
  if (this._uvc) {
    this._value = v ? 1 : 0;
    this._uvc(new Buffer([this._value]));
  }
}

module.exports = BtnStateChar;
