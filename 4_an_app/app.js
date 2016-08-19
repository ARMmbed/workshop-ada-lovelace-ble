'use strict';

// @todo, handle disconnects

var ledState, btnState;

function updateState(state) {
  document.querySelector('#state').textContent = state;
}

function updateButtonState(value) {
  document.querySelector('#btn-state').textContent = value ? 'Pressed' : 'Not pressed';
}

function onDisconnected() {
  updateState('Disconnected');
}

document.querySelector('#connect').onclick = function() {
  var name = document.querySelector('#device-name').value;
  var chars = {
    ledState: [ 0x6810, 0x6811 ],
    btnState: [ 0x6910, 0x6911 ]
  };

  // find a device, and load the characteristics shown above
  simpleBleConnect(name, chars, updateState, onDisconnected)
    .then(function(chars) {
      // chars is now an object which contains the actual characteristic
      ledState = chars.ledState;
      btnState = chars.btnState;


      // YOUR CODE HERE


    });
};
