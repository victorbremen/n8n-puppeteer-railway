const express = require('express');
const scrapeInfoJobs = require('./custom-scripts/scrapeInfoJobs');
const app = express();
const port = process.env.PORT || 3000;

app.get('/run-scraper', async (req, res) => {
  try {
    const results = await scrapeInfoJobs();
    res.json({ success: true, data: results });
  } catch (error) {
    console.error('Scraping failed:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
