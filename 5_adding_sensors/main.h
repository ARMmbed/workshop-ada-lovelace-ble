#include <mbed-events/events.h>
#include <mbed.h>       // this tells us to load mbed related functions
#include "SimpleBLE.h"  // the bluetooth library

static EventQueue eventQueue(10 * 32);   // use an event queue to dispatch events

SimpleBLE ble("YOUR_NAME_HERE", 100);    // change this to your *unique* name

DigitalOut alivenessLed(LED1);

// This is the sensor state, which we can only read
SimpleChar<uint32_t> mySensorState = ble.readOnly_u32(0x6710, 0x6711);

void alive() {
    alivenessLed = !alivenessLed;
}

// YOUR CODE HERE


// this code runs when the microcontroller starts up
int main() {
    Ticker t1;
    t1.attach(alive, 0.5f);

    // mbed OS is an RTOS (realtime OS), so we have access to things like threads
    Thread sensorThread;
    sensorThread.start(&readSensorState);

    ble.start(&eventQueue);

    while (1) {
        eventQueue.dispatch();
    }
}
