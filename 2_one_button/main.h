#include "mbed.h"       // this tells us to load mbed related functions

DigitalOut led1(LED1);         // we create a variable 'led1', use it as an out port

InterruptIn btn1(BLE_BUTTON_PIN_NAME);     // we create a variable 'btn1', use it as an in port

// YOUR CODE HERE


// this code runs when the microcontroller starts up
int main() {
    led1 = BUILT_IN_LED_OFF; // turn off led1 on startup

    btn1.fall(toggle_led);

    // spin in a main loop. Wait for interrupts.
    while(1) {}
}
