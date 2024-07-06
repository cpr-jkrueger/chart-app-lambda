# Node.js 14 is providing a pre-configured environment with Node.js installed
FROM public.ecr.aws/lambda/nodejs:18

COPY . ${LAMBDA_TASK_ROOT}

# Install yarn first so we can use yarn.lock file
# TODO: is there a better way around this?
RUN npm install -g yarn

RUN yarn install --production

# Print base-level files and directories in ${LAMBDA_TASK_ROOT}
RUN ls -l /var/task

# Exposed port inside of the container (not necessary for lambda)
# TODO: consider removing. Only necessary locally
EXPOSE 8080

# Define the command to run your app using Node.js
CMD [ "lambda.handler" ]