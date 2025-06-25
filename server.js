const express = require('express');
const { exec } = require('child_process');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/run-scraper', (req, res) => {
    exec('node custom-scripts/scrapeInfoJobs.js', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send(`Error running scraper: ${error.message}`);
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        res.send('Scraping complete!');
    });
});

app.listen(PORT, () => {
    console.log(`✅ Server listening on port ${PORT}`);
});
