'use strict';

// @todo, handle disconnects

function updateState(state) {
  document.querySelector('#state').textContent = state;
}

function onDisconnected() {
  updateState('Disconnected');
}

document.querySelector('#connect').onclick = function() {
  var name = document.querySelector('#device-name').value;
  var chars = {
    sensorState: [ 0x6710, 0x6711 ]
  };

  simpleBleConnect(name, chars, updateState, onDisconnected)
    .then(function(chars) {
      // chars is now an object which contains the actual characteristic
      var sensorState = chars.sensorState;

      // YOUR CODE HERE

      // subscribe to notifications, and push it to firebase
      sensorState.startNotifications();
      sensorState.addEventListener('characteristicvaluechanged', function(e) {
        var state = e.target.value.getUint8(0) + (e.target.value.getUint8(1) << 8) +
            (e.target.value.getUint8(2) << 16) + (e.target.value.getUint8(3) << 24);

        document.querySelector('#sensor-value').textContent = state;

        firebase.database().ref(name + '/value').push({
          ts: +new Date(),
          state: state
        });
      });

    });


    // You can also retrieve data from Firebase, and then use it to write to a characteristic
    // for example, here is how to listen for changes on a resource, then call a characteristic with that value
    // (where servoState is a BLE characteristic)
    /*
      var servoValue = firebase.database().ref('servo/0/value');
      servoValue.on('value', function(snapshot) {
        servoState.writeValue(new Uint8Array([ snapshot.val() ]));
      });
    */
    // You can write to this value from a server or another app...
};

// at some point you probably want authentication ;-)
firebase.auth().signInAnonymously();
