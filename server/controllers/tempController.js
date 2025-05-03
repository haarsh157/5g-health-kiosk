const { execFile } = require("child_process");
const path = require("path");

const getTemperature = (req, res) => {
  const scriptPath = path.resolve("sensors/temperature.py");

  execFile("python3", [scriptPath], (error, stdout, stderr) => {
    if (error) {
      console.error("Error executing Python script:", error);
      return res.status(500).json({ error: "Failed to read temperature" });
    }

    try {
      const result = JSON.parse(stdout);
      res.json({ success: true, temperature: result });
    } catch (err) {
      console.error("Invalid JSON from Python script:", stdout);
      res.status(500).json({ error: "Invalid temperature data" });
    }
  });
};

module.exports = { getTemperature };