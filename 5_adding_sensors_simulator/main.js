var MY_UNIQUE_NAME = 'MY_NAME';

var bleno = require('bleno');
var sensorService = require('./sensor-service');

var stdin = process.stdin;
stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf-8');

var sensorService = new sensorService();

bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    bleno.startAdvertising(MY_UNIQUE_NAME, [sensorService.uuid]);
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function(error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

  if (!error) {
    bleno.setServices([sensorService], function(error){
      console.log('setServices: '  + (error ? 'error ' + error : 'success'));
      console.log('Listening under name \'' + MY_UNIQUE_NAME + '\'');
    });
  }
});

stdin.on( 'data', function( key ){
  // ctrl-c ( end of text )
  if ( key === '\u0003' ) {
    process.exit();
  }
  if (key === 'u') {
    sensorService.sensorState.up();
  }
  else if (key === 'd') {
    sensorService.sensorState.down();
  }
});

console.log('Temperature is floating between %d and %d degrees. Press \'u\' for up, \'d\' for down.',
  sensorService.sensorState._value, sensorService.sensorState._value + 0.5);
