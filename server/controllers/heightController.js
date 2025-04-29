const { exec } = require('child_process');
const path = require('path');

// Endpoint to get the height from the sensor
const measureHeight = (req, res) => {
  const pythonScriptPath = path.join(__dirname, '../../sensor/measure_sensor.py');

  exec(`python3 ${pythonScriptPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).json({ error: 'Error executing Python script' });
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.status(500).json({ error: 'Error in Python script execution' });
    }

    try {
      // Parse the output (it's a JSON object from the Python script)
      const heightData = JSON.parse(stdout);

      // Send the result back to the client
      res.json(heightData);
    } catch (parseError) {
      console.error('Error parsing Python script output:', parseError);
      res.status(500).json({ error: 'Error parsing the result' });
    }
  });
};

module.exports = { measureHeight };
