# Use Node.js LTS version
FROM node:18-alpine

# Install dependencies for building native modules (sharp)
RUN apk add --no-cache python3 make g++ 

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy application source
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Create non-root user to run the app
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership of the app directory to nodejs user
RUN chown -R nodejs:nodejs /usr/src/app

USER nodejs

# Start the application
CMD ["node", "src/index.js"]