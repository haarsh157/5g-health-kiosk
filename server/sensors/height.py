# measure_sensor.py
import time
import pigpio
import numpy as np

# Setup
pi = pigpio.pi()  # Connect to pigpio daemon
TRIGGER_PIN = 23
ECHO_PIN = 24

pi.set_mode(TRIGGER_PIN, pigpio.OUTPUT)
pi.set_mode(ECHO_PIN, pigpio.INPUT)

def get_distance():
    # Send a 10 microsecond pulse to trigger
    pi.write(TRIGGER_PIN, 1)
    time.sleep(0.00001)  # 10 microseconds
    pi.write(TRIGGER_PIN, 0)

    # Measure time for echo to return
    pulse_start = time.time()
    pulse_end = time.time()

    while pi.read(ECHO_PIN) == 0:
        pulse_start = time.time()

    while pi.read(ECHO_PIN) == 1:
        pulse_end = time.time()

    # Calculate distance based on time
    pulse_duration = pulse_end - pulse_start
    distance = pulse_duration * 17150  # Speed of sound: 34300 cm/s / 2 for round trip
    distance = round(distance, 2)  # cm

    return distance

def measure_height():
    measurements = []

    # Take 1000 measurements
    for _ in range(1000):
        distance = get_distance()
        measurements.append(distance)
        time.sleep(0.05)  # Give a slight delay between measurements (50ms)

    # Convert to numpy array for easier statistical calculations
    measurements = np.array(measurements)

    # Calculate mean and standard deviation
    mean_distance = np.mean(measurements)
    std_dev = np.std(measurements)

    # Filter out outliers (values outside 2 standard deviations from the mean)
    lower_bound = mean_distance - 2 * std_dev
    upper_bound = mean_distance + 2 * std_dev
    filtered_measurements = measurements[(measurements >= lower_bound) & (measurements <= upper_bound)]

    # Calculate the final average after filtering out outliers
    final_distance = np.mean(filtered_measurements)

    # Assuming the sensor is mounted 2 meters above the ground
    height_from_sensor = 200  # cm
    height_cm = max(0, height_from_sensor - final_distance)
    
    feet = int(height_cm / 30.48)  # Convert to feet
    inches = round((height_cm % 30.48) / 2.54)  # Convert remaining cm to inches

    return {"cm": height_cm, "feet": f"{feet} feet {inches} inches"}

if __name__ == "__main__":
    height = measure_height()
    print(height)
    pi.stop()  # Close the connection to pigpio
