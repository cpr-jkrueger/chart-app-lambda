const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Serve the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the highcharts library from node_modules
app.use('/highcharts', express.static(path.join(__dirname, 'node_modules/highcharts')));

const routes = require('./routes');
app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;