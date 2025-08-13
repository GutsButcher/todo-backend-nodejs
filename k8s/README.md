# Kubernetes Deployment for Todo Backend

This directory contains all the Kubernetes manifests required to deploy the Todo Backend application.

## Architecture

The deployment consists of:
- **Todo Backend Application**: Node.js application with 2 replicas
- **MongoDB Database**: Single instance with persistent storage
- **NodePort Service**: Exposes the application on port 30080

## Files Overview

- `deployment.yaml` - Main application deployment (2 replicas)
- `service.yaml` - NodePort service exposing the app on port 30080
- `mongodb-deployment.yaml` - MongoDB database deployment
- `mongodb-service.yaml` - Internal service for MongoDB
- `configmap.yaml` - Application configuration (MongoDB URL)
- `sealed-secret.yaml` - Encrypted sensitive data (JWT secret) using Sealed Secrets
- `mongodb-pvc.yaml` - Persistent volume claim for MongoDB data
- `deploy.sh` - Automated deployment script

## Prerequisites

1. Kubernetes cluster (local or cloud)
2. kubectl configured to access your cluster
3. Docker image pushed to registry

## Quick Deploy

```bash
# Deploy everything at once
./deploy.sh

# Or deploy manually
kubectl apply -f configmap.yaml
kubectl apply -f sealed-secret.yaml
kubectl apply -f mongodb-pvc.yaml
kubectl apply -f mongodb-deployment.yaml
kubectl apply -f mongodb-service.yaml
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
```

## Access the Application

After deployment, the application will be accessible at:
```
http://<NODE_IP>:30080
```

To get your node IP:
```bash
kubectl get nodes -o wide
```

## Verify Deployment

```bash
# Check all resources
kubectl get all

# Check pods
kubectl get pods

# Check logs
kubectl logs -l app=todo-backend

# Check service
kubectl get svc todo-backend-service
```

## Configuration

### Environment Variables
- `PORT`: Application port (3000)
- `MONGODB_URL`: MongoDB connection string (from ConfigMap)
- `JWT_SECRET`: JWT secret key (from Secret)

### Resource Limits
- **Todo Backend**: 256Mi-512Mi memory, 250m-500m CPU
- **MongoDB**: 512Mi-1Gi memory, 250m-500m CPU

### Storage
- MongoDB uses a 5Gi PersistentVolumeClaim for data persistence

## Security Notes

🔒 **Enhanced Security**: This deployment uses Sealed Secrets for secure secret management:
- Secrets are encrypted using the cluster's public key
- Only the Sealed Secrets controller in the cluster can decrypt them
- Safe to commit `sealed-secret.yaml` to version control

### Creating/Updating Secrets

To create a new secret or update the JWT secret:
```bash
# Create a new secret
kubectl create secret generic todo-backend-secret \
  --from-literal=jwt-secret="your-new-strong-secret" \
  --dry-run=client -o yaml | \
  kubeseal --controller-namespace sealed-secrets -o yaml > sealed-secret.yaml

# Apply the sealed secret
kubectl apply -f sealed-secret.yaml
```

### Prerequisites for Sealed Secrets
- Sealed Secrets controller must be installed in the cluster
- Controller is expected to be in `sealed-secrets` namespace
- Install with: `kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.24.0/controller.yaml`

## Troubleshooting

### Pods not starting
```bash
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```

### MongoDB connection issues
```bash
# Check MongoDB service
kubectl get svc mongodb-service
kubectl exec -it <app-pod> -- nslookup mongodb-service
```

### Application not accessible
```bash
# Check NodePort service
kubectl get svc todo-backend-service
# Ensure firewall rules allow port 30080
```

## Cleanup

To remove all resources:
```bash
kubectl delete -f .
# Or delete namespace
kubectl delete namespace todo-app
```