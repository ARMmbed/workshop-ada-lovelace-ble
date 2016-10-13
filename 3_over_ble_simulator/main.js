var MY_UNIQUE_NAME = 'MY_NAME';

var bleno = require('bleno');
var LedService = require('./led-service');
var BtnService = require('./btn-service');

var stdin = process.stdin;
stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf-8');

var ledService = new LedService();
var btnService = new BtnService();

bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    bleno.startAdvertising(MY_UNIQUE_NAME, [ledService.uuid, btnService.uuid]);
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function(error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

  if (!error) {
    bleno.setServices([ledService, btnService], function(error){
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
  if (key === 'p') {
    btnService.btnState.setValue(true);
    console.log('Button is pressed, press \'r\' to release');
  }
  else if (key === 'r') {
    btnService.btnState.setValue(false);
    console.log('Button is not pressed, press \'p\' to press');
  }
});

console.log('Button is not pressed, press \'p\' to press');
