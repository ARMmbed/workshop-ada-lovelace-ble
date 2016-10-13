#include <mbed-events/events.h>
#include <mbed.h>       // this tells us to load mbed related functions
#include "SimpleBLE.h"  // the bluetooth library

static EventQueue eventQueue(10 * 32);   // use an event queue to dispatch events

SimpleBLE ble("YOUR_NAME_HERE", 100);    // change this to your *unique* name

DigitalOut led1(D4);         // we create a variable 'led1', use it as an out port
InterruptIn btn1(BLE_BUTTON_PIN_NAME);     // we create a variable 'btn1', use it as an in port

DigitalOut alivenessLed(LED1);

// YOUR CODE HERE


void alive() {
    alivenessLed = !alivenessLed;
}

// this code runs when the microcontroller starts up
int main() {
    printf("Hello world...\r\n");

    Ticker t;
    t.attach(&alive, 0.5f);

    // listen both for button falling (pressing in) and rising (going up again)
    btn1.rise(btn_rise);
    btn1.fall(btn_fall);

    ble.start(&eventQueue);

    while (1) {
        eventQueue.dispatch();
    }
}
