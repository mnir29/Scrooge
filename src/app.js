/*
 * Simple node.js web-server created with express framework
 *
 * Created by: Markku Nirkkonen
 *
 */

const express = require('express');
const app = express();
const api = require('./router/api');
const bodyParser = require('body-parser');
const path = require('path');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// To find React applications public folder
app.use('/', express.static(path.join(__dirname, '/scrooge-app/build')));

app.use('/', express.static('public'));


app.use('/api/', api);

// To launch React application when page is loaded
app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, '/scrooge-app/build/index.html'));
});

console.log("Server listening to port 3000")
app.listen(3000);