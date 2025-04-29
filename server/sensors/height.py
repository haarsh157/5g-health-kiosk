import time
import pigpio
import json
import sys
import numpy as np
from scipy import stats

TRIGGER_PIN = 23
ECHO_PIN = 24
REFERENCE_HEIGHT_CM = 200
NUM_MEASUREMENTS = 20
DELAY_BETWEEN_MEASUREMENTS = 0.1  # seconds

def measure_distance(pi):
    pi.write(TRIGGER_PIN, 0)
    time.sleep(0.002)

    pi.write(TRIGGER_PIN, 1)
    time.sleep(0.00001)
    pi.write(TRIGGER_PIN, 0)

    start_time = time.time()
    timeout = start_time + 0.05

    while pi.read(ECHO_PIN) == 0:
        start = time.time()
        if time.time() > timeout:
            raise Exception("Echo start timeout")

    while pi.read(ECHO_PIN) == 1:
        end = time.time()
        if time.time() > timeout:
            raise Exception("Echo end timeout")

    duration = end - start
    distance_cm = duration * 17150
    return round(distance_cm, 2)

try:
    pi = pigpio.pi()
    if not pi.connected:
        raise Exception("Pigpio daemon not connected")

    pi.set_mode(TRIGGER_PIN, pigpio.OUTPUT)
    pi.set_mode(ECHO_PIN, pigpio.INPUT)

    distances = []

    for _ in range(NUM_MEASUREMENTS):
        try:
            dist = measure_distance(pi)
            distances.append(dist)
        except Exception:
            continue
        time.sleep(DELAY_BETWEEN_MEASUREMENTS)

    if len(distances) < 5:
        raise Exception("Not enough valid measurements")

    distances_np = np.array(distances)

    # Filter out outliers using Z-score
    z_scores = np.abs(stats.zscore(distances_np))
    filtered = distances_np[z_scores < 1.0]

    if len(filtered) == 0:
        raise Exception("All measurements filtered as outliers")

    avg_distance = np.mean(filtered)
    height_cm = REFERENCE_HEIGHT_CM - avg_distance
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
