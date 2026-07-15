# Use official Node.js image (Alpine for smaller size)
FROM node:22-alpine

# Install OpenSSL (required for Prisma)
RUN apk add --no-cache openssl

# Set working directory inside container
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose the port the app runs on
EXPOSE 5000

# Start the application
CMD ["npm", "run", "dev"]
