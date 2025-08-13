#!/bin/bash

# Script to manually build and push the latest tag

# Set your Docker Hub username
DOCKER_USERNAME="${DOCKER_USERNAME:-gwynbliedd}"

echo "Building and pushing Docker image with latest tag..."

# Build the image
docker build -t $DOCKER_USERNAME/todo-backend-nodejs:latest .

# Login to Docker Hub
echo "Please login to Docker Hub:"
docker login

# Push the image
docker push $DOCKER_USERNAME/todo-backend-nodejs:latest

echo "Successfully pushed $DOCKER_USERNAME/todo-backend-nodejs:latest"

# Optional: Also push with a timestamp tag
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
docker tag $DOCKER_USERNAME/todo-backend-nodejs:latest $DOCKER_USERNAME/todo-backend-nodejs:$TIMESTAMP
docker push $DOCKER_USERNAME/todo-backend-nodejs:$TIMESTAMP

echo "Also pushed with timestamp tag: $DOCKER_USERNAME/todo-backend-nodejs:$TIMESTAMP"