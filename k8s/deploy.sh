#!/bin/bash

# Deploy Todo Backend Application to Kubernetes

echo "🚀 Starting deployment of Todo Backend application..."

# Create namespace if it doesn't exist
kubectl create namespace todo-app --dry-run=client -o yaml | kubectl apply -f -

# Apply configurations in order
echo "📦 Creating ConfigMap..."
kubectl apply -f configmap.yaml -n todo-app

echo "🔐 Creating Sealed Secret..."
kubectl apply -f sealed-secret.yaml -n todo-app

echo "💾 Creating MongoDB PVC..."
kubectl apply -f mongodb-pvc.yaml -n todo-app

echo "🗄️ Deploying MongoDB..."
kubectl apply -f mongodb-deployment.yaml -n todo-app
kubectl apply -f mongodb-service.yaml -n todo-app

# Wait for MongoDB to be ready
echo "⏳ Waiting for MongoDB to be ready..."
kubectl wait --for=condition=ready pod -l app=mongodb -n todo-app --timeout=120s

echo "🚀 Deploying Todo Backend application..."
kubectl apply -f deployment.yaml -n todo-app
kubectl apply -f service.yaml -n todo-app

# Wait for application to be ready
echo "⏳ Waiting for application pods to be ready..."
kubectl wait --for=condition=ready pod -l app=todo-backend -n todo-app --timeout=120s

echo "✅ Deployment complete!"
echo ""
echo "📊 Deployment status:"
kubectl get all -n todo-app
echo ""
echo "🔗 Application will be available at: http://<NODE_IP>:30080"
echo "   To get your node IP, run: kubectl get nodes -o wide"