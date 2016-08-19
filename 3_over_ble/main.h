#include "mbed_events.h"
#include "mbed.h"       // this tells us to load mbed related functions
#include "SimpleBLE.h"  // the bluetooth library

static EventQueue eventQueue(10 * 32);   // use an event queue to dispatch events

SimpleBLE ble("YOUR_NAME_HERE", 100);    // change this to your *unique* name

DigitalOut led1(LED1);         // we create a variable 'led1', use it as an out port
InterruptIn btn1(BUTTON1);     // we create a variable 'btn1', use it as an in port

DigitalOut alivenessLed(LED2);

// YOUR CODE HERE


void alive() {
    alivenessLed = !alivenessLed;
}

// this code runs when the microcontroller starts up
int main() {
    Ticker t;
    t.attach(&alive, 0.5f);

    led1 = BUILT_IN_LED_OFF; // turn off led1 on startup

    // listen both for button falling (pressing in) and rising (going up again)
    btn1.rise(btn_rise);
    btn1.fall(btn_fall);

    ble.start(&eventQueue);

    while (1) {
        eventQueue.dispatch();
    }
}
