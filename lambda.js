const awsServerlessExpress = require('aws-serverless-express');
const app = require('./app');
const server = awsServerlessExpress.createServer(app);

exports.handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false; // Ensure Lambda does not wait for event loop to be empty
    return awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise;
};

// const awsServerlessExpress = require('aws-serverless-express');
// const app = require('./app');
// const util = require('util');

// const server = awsServerlessExpress.createServer(app);
// const proxy = util.promisify(awsServerlessExpress.proxy.bind(awsServerlessExpress, server));

// exports.handler = async (event, context) => {
//     context.callbackWaitsForEmptyEventLoop = false;

//     try {
//         await proxy(event, context);
//         return { statusCode: 200, body: JSON.stringify({ message: "Success" }) };
//     } catch (error) {
//         console.error('Error:', error);
//         return { statusCode: 500, body: JSON.stringify({ message: "Internal server error" }) };
//     }
// };