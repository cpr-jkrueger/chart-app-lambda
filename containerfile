# Node.js 14 is providing a pre-configured environment with Node.js installed
FROM public.ecr.aws/lambda/nodejs:18

# This is how what the filepath inside of the container will look like, that contains all our project's files
WORKDIR ${LAMBDA_TASK_ROOT}

COPY . .

# Install yarn first so we can use yarn.lock file
# TODO: is there a better way around this?
RUN npm install -g yarn

RUN yarn install --production

# Exposed port inside of the container (not necessary for lambda)
# TODO: consider removing. Only necessary locally
EXPOSE 8080

# Define the command to run your app using Node.js
CMD [ "lambda.handler" ]