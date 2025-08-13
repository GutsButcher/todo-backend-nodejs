#!/bin/bash

# Deploy Todo Backend Application using Kustomize to Production

echo "🚀 Starting deployment to production environment using Kustomize..."

# Check if kustomize is available
if ! command -v kustomize &> /dev/null && ! kubectl kustomize --help &> /dev/null; then
    echo "❌ Kustomize is not installed. Install it or use kubectl 1.14+"
    exit 1
fi

# Optional: Set specific image tag
if [ ! -z "$1" ]; then
    echo "📦 Setting image tag to: $1"
    cd overlays/prod
    kustomize edit set image gwynbliedd/todo-backend-nodejs:$1
    cd ../..
fi

# Preview what will be deployed
echo "👀 Preview of resources to be deployed:"
kubectl kustomize k8s/overlays/prod | kubectl diff -f - || true

echo ""
read -p "📋 Do you want to proceed with the deployment? (y/N) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Deploying to production..."
    
    # First, handle existing PVC if it exists
    echo "🔧 Checking for existing PVC..."
    if kubectl get pvc mongodb-pvc -n todo-prod &> /dev/null; then
        PVC_STATUS=$(kubectl get pvc mongodb-pvc -n todo-prod -o jsonpath='{.status.phase}')
        if [[ "$PVC_STATUS" == "Pending" ]]; then
            echo "⚠️  Found existing PVC in Pending state. Deleting it..."
            kubectl delete pvc mongodb-pvc -n todo-prod --force --grace-period=0
            sleep 2
        fi
    fi
    
    # Apply the kustomization
    kubectl apply -k k8s/overlays/prod
    
    NAMESPACE="todo-prod"
    
    echo "⏳ Waiting for deployments to be ready..."
    kubectl wait --for=condition=available --timeout=300s deployment/todo-backend -n $NAMESPACE
    kubectl wait --for=condition=ready pod -l app=mongodb -n $NAMESPACE --timeout=120s
    
    echo "✅ Deployment complete!"
    echo ""
    echo "📊 Resources in $NAMESPACE namespace:"
    kubectl get all -n $NAMESPACE
    kubectl get pvc -n $NAMESPACE
else
    echo "❌ Deployment cancelled"
fi