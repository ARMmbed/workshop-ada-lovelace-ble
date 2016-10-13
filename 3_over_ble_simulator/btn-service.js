var util = require('util');

var bleno = require('bleno');

var BlenoPrimaryService = bleno.PrimaryService;

var BtnStateChar = require('./btn-state-char');

function ButtonService() {
  var c = new BtnStateChar();
  ButtonService.super_.call(this, {
      uuid: '6910',
      characteristics: [
          c
      ]
  });
  this.btnState = c;
}

util.inherits(ButtonService, BlenoPrimaryService);

module.exports = ButtonService;
