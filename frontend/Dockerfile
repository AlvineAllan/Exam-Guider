# Use official Node.js image (Alpine for smaller size)
FROM node:22-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port Vite runs on
EXPOSE 5173

# Start Vite dev server with host flag for container access
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]