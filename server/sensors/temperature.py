import smbus2
import time
import statistics
import json

# Constants
MLX90614_I2C_ADDR = 0x5A
MLX90614_TOBJ1_REG = 0x07  # Object temperature register

# Initialize I2C bus 4
bus = smbus2.SMBus(4)

def read_temp_raw():
    """Reads raw temperature data from MLX90614."""
    try:
        data = bus.read_word_data(MLX90614_I2C_ADDR, MLX90614_TOBJ1_REG)
        # MLX90614 returns data in a weird byte order (LSB/MSB)
        data = ((data & 0xFF) << 8) | (data >> 8)
        temp_celsius = (data * 0.02) - 273.15
        return temp_celsius
    except Exception as e:
        print(f"Error reading temperature: {e}")
        return None

def get_temperature_statistics(samples=10, delay=0.5):
    """Reads temperature samples and returns statistical results."""
    readings = []

    while len(readings) < samples:
        temp = read_temp_raw()
        if temp is not None:
            readings.append(temp)
        time.sleep(delay)

    result = {
        "readings": readings,
        "mean": round(statistics.mean(readings), 2),
        "median": round(statistics.median(readings), 2),
        "std_dev": round(statistics.stdev(readings), 2) if len(readings) > 1 else 0.0,
        "min": round(min(readings), 2),
        "max": round(max(readings), 2)
    }

    return json.dumps(result, indent=4)

if __name__ == "__main__":
    print(get_temperature_statistics())
