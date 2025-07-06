const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { PythonShell } = require('python-shell');

const router = express.Router();
const upload = multer({ dest: path.join(__dirname, '../uploads') });

/**
 * Helper function 
 */
const runPythonScript = (scriptName, args, scriptPath) => {
  return new Promise((resolve, reject) => {
    console.log(`Running script: ${scriptName} with args: ${args}`);

    const pyshell = new PythonShell(scriptName, { scriptPath, args });

    //  all console.log prints 
    pyshell.on('message', (message) => {
      console.log(`[Python]: ${message}`);
    });

    pyshell.end((err, code, signal) => {
      if (err) {
        console.error(`${scriptName} execution failed:`, err);
        return reject(err);
      }
      console.log(`${scriptName} executed successfully with exit code ${code}`);
      resolve();
    });
  });
};

//  POST /api 
// Upload CSV, run combined_models.py
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const uploadedFilePath = path.resolve(req.file.path);
    const mlPath = path.join(__dirname, '../models');
    const resultsPath = path.join(__dirname, '../results');
    const combinedResultsPath = path.join(resultsPath, 'final_combined_results.json');

    console.log("✅ Uploaded file absolute path:", uploadedFilePath);

    // Run Combined Models Script with live logging
    await runPythonScript('combined_models.py', [uploadedFilePath], mlPath);

    // Check if output exists
    if (!fs.existsSync(combinedResultsPath)) {
      throw new Error("final_combined_results.json not found. Script might have failed before saving it.");
    }

    const combined = JSON.parse(fs.readFileSync(combinedResultsPath));
    res.status(200).json(combined);
    console.log("✅ Combined results sent to client.");

  } catch (err) {
    console.error('❌ Error during ML processing:', err.message);
    res.status(500).json({ error: 'Model execution failed', details: err.message });
  }
});

//  GET /api/results 
// Returns latest saved combined results
router.get('/results', (req, res) => {
  const resultsPath = path.join(__dirname, '../results/final_combined_results.json');
  if (fs.existsSync(resultsPath)) {
    const results = JSON.parse(fs.readFileSync(resultsPath));
    res.status(200).json(results);
  } else {
    res.status(404).json({ error: 'Results not found' });
  }
});

module.exports = router;
