import smbus2
import time
import statistics
import json

# Constants for the MLX90614 sensor
MLX90614_I2C_ADDR = 0x5A
MLX90614_OBJECT_TEMP = 0x07

# Use I2C bus 4 (GPIO 13 = SDA, GPIO 19 = SCL)
bus = smbus2.SMBus(4)

def read_temperature():
    try:
        # Read two bytes of data
        data = bus.read_word_data(MLX90614_I2C_ADDR, MLX90614_OBJECT_TEMP)
        # Convert to correct byte order
        temp_raw = ((data & 0xFF) << 8) | ((data >> 8) & 0xFF)
        # Convert to Celsius
        return temp_raw * 0.02 - 273.15
    except Exception as e:
        raise RuntimeError(f"I2C read error: {e}")

def get_accurate_temperature(samples=20, delay=0.1):
    readings = []
    for _ in range(samples):
        try:
            temp = read_temperature()
            readings.append(temp)
        except:
            continue
        time.sleep(delay)

    if not readings:
        raise RuntimeError("No temperature readings collected")

    # Remove outliers using standard deviation filtering
    mean = statistics.mean(readings)
    stdev = statistics.stdev(readings)
    filtered = [r for r in readings if abs(r - mean) <= stdev]

    final_celsius = round(statistics.mean(filtered), 2)
    final_fahrenheit = round((final_celsius * 9 / 5) + 32, 2)

    return {
        "celsius": final_celsius,
        "fahrenheit": final_fahrenheit
    }

if __name__ == "__main__":
    try:
        temperature_data = get_accurate_temperature()
        print(json.dumps(temperature_data))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
