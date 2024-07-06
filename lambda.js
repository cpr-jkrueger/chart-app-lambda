const awsServerlessExpress = require('aws-serverless-express');
const app = require('./app');
const server = awsServerlessExpress.createServer(app);

exports.handler = async (event, context) => {
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

// // Import the router from routes.js
// const router = require('./routes');

// // Use the router with your Express app
// app.use('/', router);