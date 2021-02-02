/*
 * Simple API router for web-application
 *
 * Created by: Markku Nirkkonen
 */ 

const express = require('express');
const router = express.Router();
const dataMethods = require('../data/data');


// Saving stock data
router.post('/data', function(req, res) {
  const status = dataMethods.saveData(req.body.data);
  res.json(status);
});

// Analysis of the data, if it exists
router.post('/data/analysis', function (req, res) {
  if (req.body.start && req.body.end) {
    const analyzedData = dataMethods.analyzeData(req.body.start, req.body.end);
    res.json(analyzedData);
  } else {
    res.json("Check date inputs");
  }
});

module.exports = router;