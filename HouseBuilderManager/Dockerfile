# ---- Build stage ----
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest
COPY . .

# Build the app
RUN npm run build:all

# ---- Run stage ----
FROM node:18-alpine
WORKDIR /app

COPY --from=builder /app ./

# Expose the port
EXPOSE 3000

# Start your server
CMD ["node", "--es-module-specifier-resolution=node", "server/index-render.js"]
