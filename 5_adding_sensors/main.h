#include "mbed_events.h"
#include "mbed.h"       // this tells us to load mbed related functions
#include "SimpleBLE.h"  // the bluetooth library

static EventQueue eventQueue(10 * 32);   // use an event queue to dispatch events

SimpleBLE ble("YOUR_NAME_HERE", 100);    // change this to your *unique* name

DigitalOut alivenessLed(LED1);

SimpleChar<uint32_t> mySensorState = ble.readOnly_u32(0x6710, 0x6711);

void read_sensor() {
    // YOUR CODE HERE
    // mySensorState = /* read value from your sensor */
}

void alive() {
    alivenessLed = !alivenessLed;
}

// this code runs when the microcontroller starts up
int main() {
    Ticker t;
    t.attach(&alive, 0.5f);

    ble.start(&eventQueue);

    Ticker t2;
    t2.attach(&read_sensor, 2.0f);

    while (1) {
        eventQueue.dispatch();
    }
}
