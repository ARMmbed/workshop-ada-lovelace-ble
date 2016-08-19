#include "mbed.h"  // this tells us to load mbed related functions

DigitalOut myled(LED1);             // we create a variable 'myled', use it as an out port
Ticker flipper;   //Ticker = recurring interrupt to repeatedly call a function at a specified rate

// YOUR CODE HERE

// this code runs when the microcontroller starts up
int main() {
    myled = BUILT_IN_LED_OFF;  //turn the led off (this is a boolean, it's on or off)

    // we want to blink an led, every 500 ms.
    flipper.attach(&blinky, 0.5); // the address of the function to be attached (flip) and the interval (in seconds)

    // spin in a main loop. flipper will interrupt it to call flip
    while(1) {}
}
