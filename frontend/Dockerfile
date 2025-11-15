# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app files
COPY . .

# Build the production frontend (optional: can also serve dev server)
RUN npm run build

# Expose port for dev server (if running in dev mode)
EXPOSE 5173

# Start the dev server
CMD ["npm", "run", "dev"]
