## To run locally
yarn install
node app.js

## To run on podman container (won't work with Lambda configured containerfile)
podman build -t wattplan-chart-image-generator -f containerfile
> `-f` flag specifies the name of the containerfile podman should use to build the image
> `-t` flag tags the resulting image with the specified name

podman run -p 9000:8080 wattplan-chart-image-generator
> `-p` publishes the container's ports to the host, allowing us to access 8080 on our machine

## Login to AWS (only need to do this once)
Connect-AWS
> This logs you in to AWS

aws ecr get-login-password --region us-west-2 --profile DEV-WattPlan-Intern | podman login --username AWS --password-stdin 250657904178.dkr.ecr.us-west-2.amazonaws.com/wattplan-chart-image-generator
> Retrieves the ECR login password, then logs into the ECR repository using Podman


## Tag and push code to AWS
podman tag wattplan-chart-image-generator:latest 250657904178.dkr.ecr.us-west-2.amazonaws.com/wattplan-chart-image-generator:latest
> Tags the local image as the latest version for the ECR repository, preparing it for the push

podman push 250657904178.dkr.ecr.us-west-2.amazonaws.com/wattplan-chart-image-generator:latest
> Pushes the tagged image to the ECR repository
> Use `--log-level=debug` for troubleshooting

## Running on AWS
You have to redeploy image every time...
Lambda > Functions > WattPlan-Chart-Image-Generator
Under 'Image'
Deploy new image -> Select Container Image -> Find Image -> Latest -> Select Image -> Save
Under 'Test'
Test

## Connect to endpoint
curl https://cad6m6mgpc.execute-api.us-west-2.amazonaws.com/WattPlan-Chart-Image-Generator

# TODO
Get this running on AWS first with hello world
Get Yarn working

Remove unused dependencies

Get an image back from the API Gateway