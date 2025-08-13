# Kubernetes Deployment Troubleshooting

## Image Pull Error: "ImagePullBackOff"

If you're seeing errors like:
```
Failed to pull image "gwynbliedd/todo-backend-nodejs:latest": not found
```

### Possible Causes and Solutions:

1. **Docker Hub Repository Doesn't Exist**
   - Verify the Docker Hub username is correct
   - Check if the repository exists at: https://hub.docker.com/r/gwynbliedd/todo-backend-nodejs
   - Create the repository on Docker Hub if it doesn't exist

2. **Image Not Pushed**
   - Check GitHub Actions logs to verify the image was pushed successfully
   - Manually push the image:
   ```bash
   docker build -t gwynbliedd/todo-backend-nodejs:latest .
   docker push gwynbliedd/todo-backend-nodejs:latest
   ```

3. **Private Repository**
   - If the repository is private, create an image pull secret:
   ```bash
   kubectl create secret docker-registry regcred \
     --docker-server=https://index.docker.io/v1/ \
     --docker-username=<your-username> \
     --docker-password=<your-password> \
     --docker-email=<your-email>
   ```
   - Update deployment to use the secret:
   ```yaml
   spec:
     imagePullSecrets:
     - name: regcred
   ```

4. **Wrong Username in Secrets**
   - Verify the DOCKER_USERNAME secret in GitHub is correct
   - Check the workflow logs for the actual image name being pushed

### Debugging Steps:

1. **Check the pushed image tag:**
   ```bash
   # From GitHub Actions logs, find the exact image tag
   # It will be something like: gwynbliedd/todo-backend-nodejs:abc123def456
   ```

2. **Try pulling manually:**
   ```bash
   docker pull gwynbliedd/todo-backend-nodejs:latest
   ```

3. **Check deployment status:**
   ```bash
   kubectl describe pod <pod-name>
   kubectl get events --sort-by='.lastTimestamp'
   ```

4. **Test with a known working image:**
   ```bash
   kubectl apply -f debug-deployment.yaml
   ```

### Quick Fix:

If you need to deploy immediately with a different image:
```bash
# Edit the deployment to use a different image
kubectl edit deployment todo-backend

# Or patch it:
kubectl set image deployment/todo-backend todo-backend=<your-dockerhub-username>/todo-backend-nodejs:latest
```