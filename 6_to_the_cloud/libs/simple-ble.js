'use strict';

console.log = hyper.log;
console.warn = hyper.warn;
console.error = hyper.error;

var ble;

function disconnect() {
  if (ble && ble.connected) {
    console.log('Disconnecting...');
    ble.disconnect();
    ble = null;
  }
}

window.onbeforeunload = disconnect;

function onConnected(ble, characteristics, updateState) {

  var services = Object.keys(characteristics).reduce(function(curr, name, ix) {

    var service = characteristics[name][0];
    var char = characteristics[name][1];

    curr[service] = curr[service] || [];
    curr[service].push({
      char: char,
      ix: ix
    });

    return curr;

  }, {});

  console.log('services is ' + JSON.stringify(services));


  updateState('Connected, discovering services...');

  var charIndex = [];

  return Promise.all(Object.keys(services).map(function(service) {
    console.log('getService ' + service);
    return ble.getPrimaryService(Number(service));
  })).then(function(gattServices) {

    updateState('Connected, Discovering characteristics...');

    console.log('got services ' + gattServices.length);

    var allChars = gattServices.reduce(function(curr, s, ix) {
      var uuid = Object.keys(services)[ix];

      curr = curr.concat(services[uuid].map(function(c) {
        charIndex.push(c.ix);

        // c is char, ix
        return s.getCharacteristic(Number(c.char));
      }));

      return curr;
    }, []);

    return Promise.all(allChars);

  }).then(function(gattChars) {

    console.log('got chars ' + gattChars.length);

    var cKeys = Object.keys(characteristics);

    var ret = {};

    gattChars.forEach(function(gattChar, ix) {
      ret[cKeys[charIndex[ix]]] = gattChar;
    });

    updateState('Connected');

    return ret;

  }).catch(function(err) {
    updateState('Loading characteristics failed ' + err);
  });
}

function simpleBleConnect(name, characteristics, updateState, onDisconnected) {
  if (!name) {
    return alert('Select a name first please!');
  }
  localStorage.setItem('device-name', name); // store in localStorage, so when page refreshes, we still know the name

  updateState('Searching...');

  // Now we can connect to the device. This uses the same syntax as Web Bluetooth!
	return bleat.requestDevice({
    filters: [{name: name}]
	}).then(function(device) {
	  device.addEventListener('gattserverdisconnected', onDisconnected);

    updateState('Found device, connecting...');
    return device.gatt.connect();
	}).then(function(server) {
	  updateState('Connected, discovering services...');
	  ble = server;

	  return onConnected(ble, characteristics, updateState);
	}).catch(function(err) {
	  updateState('Error: ' + err.toString());
	  disconnect();
	});
}


function onStart() {
  var name = localStorage.getItem('device-name');
  if (name) {
    document.querySelector('#device-name').value = name;
  }
}

onStart();
