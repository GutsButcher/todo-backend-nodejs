# Kustomize Setup for Todo Backend

This project now uses Kustomize for managing Kubernetes configurations across different environments.

## Why Kustomize?

- **Simple**: No templating language, just YAML patches
- **Native**: Built into kubectl (v1.14+)
- **DRY**: Reuse base configurations with environment-specific overlays
- **GitOps friendly**: All changes are declarative and version controlled

## Directory Structure

```
k8s/
├── base/                    # Base configurations
│   ├── configmap.yaml
│   ├── deployment.yaml
│   ├── kustomization.yaml
│   ├── mongodb-deployment.yaml
│   ├── mongodb-pvc.yaml
│   ├── mongodb-service.yaml
│   ├── sealed-secret.yaml
│   └── service.yaml
└── overlays/               # Environment-specific configurations
    ├── dev/                # Development environment
    │   ├── deployment-patch.yaml
    │   └── kustomization.yaml
    └── prod/               # Production environment
        ├── deployment-patch.yaml
        ├── kustomization.yaml
        └── service-patch.yaml
```

## Key Differences Between Environments

### Development (`dev`)
- Namespace: `todo-dev`
- Replicas: 1 (reduced for dev)
- Resources: Lower (128Mi-256Mi memory)
- Service: NodePort

### Production (`prod`)
- Namespace: `todo-prod`
- Replicas: 3 (high availability)
- Resources: Higher (512Mi-1Gi memory)
- Service: LoadBalancer
- Stricter health checks

## Usage

### Deploy to Development
```bash
# Using the deploy script
./deploy-kustomize.sh dev

# Or manually
kubectl apply -k k8s/overlays/dev
```

### Deploy to Production
```bash
# Using the deploy script
./deploy-kustomize.sh prod

# Or manually
kubectl apply -k k8s/overlays/prod
```

### Deploy with Specific Image Tag
```bash
# Deploy to dev with specific image
./deploy-kustomize.sh dev abc123def

# Or manually update and deploy
cd k8s/overlays/prod
kustomize edit set image gwynbliedd/todo-backend-nodejs:v1.2.3
kubectl apply -k .
```

### Preview Changes
```bash
# See what will be deployed without applying
kubectl kustomize k8s/overlays/dev

# Compare with current state
kubectl diff -k k8s/overlays/dev
```

## Common Operations

### Update Image Tag
```bash
cd k8s/overlays/prod
kustomize edit set image gwynbliedd/todo-backend-nodejs:new-tag
```

### Scale Replicas
```bash
cd k8s/overlays/prod
kustomize edit set replicas todo-backend=5
```

### Add New Resource
1. Add the YAML file to `base/`
2. Add it to `base/kustomization.yaml` resources list

### Override for Specific Environment
1. Create a patch file in `overlays/<env>/`
2. Add it to `overlays/<env>/kustomization.yaml` patches list

## CI/CD Integration

The GitHub Actions workflow automatically:
1. Builds and pushes Docker image with SHA tag
2. Updates the production overlay with the new image tag
3. Applies the production configuration to the cluster

## Rollback

```bash
# View deployment history
kubectl rollout history deployment/todo-backend -n todo-prod

# Rollback to previous version
kubectl rollout undo deployment/todo-backend -n todo-prod

# Rollback to specific revision
kubectl rollout undo deployment/todo-backend -n todo-prod --to-revision=2
```

## Benefits of This Setup

1. **Environment Parity**: Same base config, only necessary differences
2. **Image Management**: CI/CD updates only the image tag
3. **Easy Rollbacks**: Kubernetes tracks deployment history
4. **GitOps Ready**: All configs in Git, changes via PR
5. **No Helm Complexity**: Simple YAML patches, no templating

## Troubleshooting

### See Final Manifests
```bash
kubectl kustomize k8s/overlays/dev > debug-output.yaml
```

### Validate Kustomization
```bash
kubectl kustomize k8s/overlays/dev | kubectl apply --dry-run=client -f -
```

### Check Current Image
```bash
kubectl get deployment todo-backend -n todo-prod -o jsonpath='{.spec.template.spec.containers[0].image}'
```