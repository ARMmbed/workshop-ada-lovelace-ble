#include <mbed-events/events.h>
#include <mbed.h>       // this tells us to load mbed related functions
#include "SimpleBLE.h"  // the bluetooth library

static EventQueue eventQueue(10 * 32);   // use an event queue to dispatch events

SimpleBLE ble("YOUR_NAME_HERE", 100);    // change this to your *unique* name

DigitalOut led1(D4);         // we create a variable 'led1', use it as an out port

DigitalOut alivenessLed(LED1);

void updateLedOverBle(bool newValue) {  // a new value was written to the LED characteristic
    led1 = newValue;
}

// we create the LED state, which you can read & write, plus a callback method
SimpleChar<bool> ledState = ble.readWrite_bool(0x6810, 0x6811, &updateLedOverBle);

// This is the sensor state, which we can only read
SimpleChar<uint32_t> mySensorState = ble.readOnly_u32(0x6920, 0x6921);

void alive() {
    alivenessLed = !alivenessLed;
}

// YOUR CODE HERE
// void readSensorState() {
//     mySensorState = mySensorState + 1;
// }

// this code runs when the microcontroller starts up
int main() {
    // Use the event queue to process events, rather than Tickers
    eventQueue.post_every(500, alive);

    eventQueue.post_every(2000, readSensorState);

    ble.start(&eventQueue);

    while (1) {
        eventQueue.dispatch();
    }
}
