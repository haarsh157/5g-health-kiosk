// server/controllers/heightController.js

const Gpio = require('pigpio').Gpio;  // Use pigpio for accurate timing

const TRIGGER_PIN = 23;  // Change according to your wiring
const ECHO_PIN = 24;

const trigger = new Gpio(TRIGGER_PIN, { mode: Gpio.OUTPUT });
const echo = new Gpio(ECHO_PIN, { mode: Gpio.INPUT, alert: true });

trigger.digitalWrite(0); // Ensure trigger is low

const measureHeight = (req, res) => {
  let startTick;

  trigger.trigger(10, 1); // Send 10 microsecond pulse

  echo.once('alert', (level, tick) => {
    if (level == 1) {
      startTick = tick;
    } else {
      const endTick = tick;
      const diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32-bit
      const distance = diff / 2 / 29.1; // Distance in cm
      const heightFromSensor = 200; // Assume sensor is mounted 2m above ground
      const height_cm = Math.max(0, heightFromSensor - distance);

      const feet = Math.floor(height_cm / 30.48);
      const inches = Math.round((height_cm % 30.48) / 2.54);

      res.json({
        cm: height_cm.toFixed(2),
        feet: `${feet} feet ${inches} inches`
      });
    }
  });
};

module.exports = { measureHeight };
