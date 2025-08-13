#!/bin/bash

# Deploy Todo Backend Application using Kustomize

# Check if environment is provided
ENV=${1:-dev}

if [[ "$ENV" != "dev" && "$ENV" != "prod" ]]; then
    echo "❌ Invalid environment. Use 'dev' or 'prod'"
    echo "Usage: ./deploy-kustomize.sh [dev|prod]"
    exit 1
fi

echo "🚀 Starting deployment to $ENV environment using Kustomize..."

# Check if kustomize is available
if ! command -v kustomize &> /dev/null && ! kubectl kustomize --help &> /dev/null; then
    echo "❌ Kustomize is not installed. Install it or use kubectl 1.14+"
    exit 1
fi

# Optional: Set specific image tag
if [ ! -z "$2" ]; then
    echo "📦 Setting image tag to: $2"
    cd overlays/$ENV
    kustomize edit set image gwynbliedd/todo-backend-nodejs:$2
    cd ../..
fi

# Preview what will be deployed
echo "👀 Preview of resources to be deployed:"
kubectl kustomize k8s/overlays/$ENV | kubectl diff -f - || true

echo ""
read -p "📋 Do you want to proceed with the deployment? (y/N) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Deploying to $ENV..."
    kubectl apply -k k8s/overlays/$ENV
    
    # Get namespace from overlay
    NAMESPACE="todo-$ENV"
    
    echo "⏳ Waiting for deployments to be ready..."
    kubectl wait --for=condition=available --timeout=300s deployment/todo-backend -n $NAMESPACE
    kubectl wait --for=condition=ready pod -l app=mongodb -n $NAMESPACE --timeout=120s
    
    echo "✅ Deployment complete!"
    echo ""
    echo "📊 Resources in $NAMESPACE namespace:"
    kubectl get all -n $NAMESPACE
    
    if [[ "$ENV" == "dev" ]]; then
        echo ""
        echo "🔗 Application will be available at: http://<NODE_IP>:30080"
        echo "   To get your node IP, run: kubectl get nodes -o wide"
    fi
else
    echo "❌ Deployment cancelled"
fi