FROM public.ecr.aws/lambda/nodejs:18

WORKDIR ${LAMBDA_TASK_ROOT}
COPY . .

# Install yarn first so we can use yarn.lock file
# TODO: is there a better way around this?
RUN npm install -g yarn
RUN yarn install --production

# # DEBUG Print base-level files and directories in ${LAMBDA_TASK_ROOT}
# RUN ls -l /var/task

# Exposed port inside of the container (not necessary for lambda)
# TODO: consider removing. Only necessary locally
EXPOSE 8080

# Define the command to run your app using Node.js
CMD [ "app.handler" ]
# TODO: should i add 'app.js' here?