import smbus2
import time
import statistics
import json

MLX90614_I2C_ADDR = 0x5A
MLX90614_OBJECT_TEMP = 0x07

bus = smbus2.SMBus(1)

def read_temperature():
    raw = bus.read_word_data(MLX90614_I2C_ADDR, MLX90614_OBJECT_TEMP)
    raw_swapped = ((raw & 0xFF) << 8) | (raw >> 8)
    return raw_swapped * 0.02 - 273.15

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
        raise RuntimeError("No valid readings")

    mean = statistics.mean(readings)
    stdev = statistics.stdev(readings) if len(readings) > 1 else 0
    filtered = [r for r in readings if abs(r - mean) <= stdev]

    final_celsius = round(statistics.mean(filtered), 2)
    final_fahrenheit = round((final_celsius * 9 / 5) + 32, 2)

    return {
        "celsius": final_celsius,
        "fahrenheit": final_fahrenheit
    }

if __name__ == "__main__":
    try:
        data = get_accurate_temperature()
        print(json.dumps(data))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
