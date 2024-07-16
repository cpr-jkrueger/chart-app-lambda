const express = require('express');
const path = require('path');
const awsServerlessExpress = require('aws-serverless-express');

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

const server = awsServerlessExpress.createServer(app);

let handler = async (event, context) => {
    try {
        console.log("Creating server...");
        const response = awsServerlessExpress.proxy(server, event, context,'PROMISE').promise;
        console.log("...server created.");
        return response;
    } catch (error) {
        console.error('Error:', error);
        return { statusCode: 500, body: JSON.stringify({ message: "Internal server error" }) };
    }
};

module.exports = { app, routes, handler };