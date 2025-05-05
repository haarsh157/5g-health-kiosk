const { exec } = require("child_process");
const path = require("path");

const measureHeight = (req, res) => {
  const pythonScriptPath = path.join(__dirname, "../sensors/height.py");

  exec(`python3 ${pythonScriptPath}`, (error, stdout, stderr) => {
    if (error || stderr) {
      console.error("Execution error:", error || stderr);
      return res.status(500).json({ error: "Sensor not connected" });
    }

    try {
      const output = JSON.parse(stdout);

      if (output.error) {
        console.error("Python error:", output.error);
        return res.status(500).json({ error: output.error });
      }

      return res.json(output);
    } catch (parseError) {
      console.error("Parsing error:", parseError);
      return res.status(500).json({ error: "Invalid sensor output" });
    }
  });
};

module.exports = { measureHeight };
