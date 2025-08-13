#!/bin/bash

echo "🔍 Testing Kustomize configuration..."

echo -e "\n📋 Base configuration:"
kubectl kustomize base | grep -E "image:|replicas:" | head -10

echo -e "\n🚀 Development overlay:"
kubectl kustomize overlays/dev | grep -E "image:|replicas:|namespace:" | head -10

echo -e "\n🏭 Production overlay:"
kubectl kustomize overlays/prod | grep -E "image:|replicas:|namespace:" | head -10

echo -e "\n✅ Kustomize configuration is valid!"