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
        # Reorder LSB and MSB
        data = ((data & 0xFF) << 8) | (data >> 8)
        temp_celsius = (data * 0.02) - 273.15
        return temp_celsius
    except Exception as e:
        print(f"Error reading temperature: {e}")
        return None

def remove_outliers_iqr(data):
    """Removes outliers using the IQR method."""
    sorted_data = sorted(data)
    q1 = statistics.median(sorted_data[:len(sorted_data)//2])
    q3 = statistics.median(sorted_data[(len(sorted_data)+1)//2:])
    iqr = q3 - q1

    lower_bound = q1 - 1.5 * iqr
    upper_bound = q3 + 1.5 * iqr

    return [x for x in data if lower_bound <= x <= upper_bound]

def get_temperature_statistics(samples=10, delay=1):
    """Reads temperature samples and returns filtered mean and Fahrenheit."""
    readings = []

    while len(readings) < samples:
        temp = read_temp_raw()
        if temp is not None:
            readings.append(temp)
        time.sleep(delay)

    filtered = remove_outliers_iqr(readings)

    if not filtered:
        return json.dumps({ "error": "No valid readings after filtering" }, indent=2)

    mean = round(statistics.mean(filtered), 2)
    result = {
        "celsius": mean,
        "fahrenheit": round((mean * 9/5) + 32, 2)
    }

    return json.dumps(result, indent=2)

if __name__ == "__main__":
    print(get_temperature_statistics())
