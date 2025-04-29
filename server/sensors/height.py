import time
import pigpio
import json
import sys

TRIGGER_PIN = 23
ECHO_PIN = 24

try:
    pi = pigpio.pi()
    if not pi.connected:
        raise Exception("Pigpio daemon not connected")

    pi.set_mode(TRIGGER_PIN, pigpio.OUTPUT)
    pi.set_mode(ECHO_PIN, pigpio.INPUT)

    pi.write(TRIGGER_PIN, 0)
    time.sleep(2)

    # Trigger the sensor
    pi.write(TRIGGER_PIN, 1)
    time.sleep(0.00001)
    pi.write(TRIGGER_PIN, 0)

    start_time = time.time()
    timeout = start_time + 0.05

    while pi.read(ECHO_PIN) == 0:
        start = time.time()
        if time.time() > timeout:
            raise Exception("Echo start timeout ? sensor not responding")

    while pi.read(ECHO_PIN) == 1:
        end = time.time()
        if time.time() > timeout:
            raise Exception("Echo end timeout ? sensor not responding")

    duration = end - start
    distance_cm = duration * 17150
    distance_cm = round(distance_cm, 2)

    height_cm = 200 - distance_cm  # assume reference height is 200 cm
    feet = int(height_cm / 30.48)
    inches = int((height_cm % 30.48) / 2.54)

    result = {
        "cm": round(height_cm, 2),
        "feet": f"{feet} feet {inches} inches"
    }

    print(json.dumps(result))

except Exception as e:
    print(json.dumps({"error": str(e)}))
    sys.exit(1)
