# --- Stage 1: Build Frontend ---
FROM node:20-alpine as frontend-builder

WORKDIR /app

# Copy frontend package files
COPY package*.json ./

# Install frontend dependencies
RUN npm ci

# Copy frontend source code
COPY . .

# Build the frontend (outputs to /app/dist)
RUN npm run build

# --- Stage 2: Setup Backend & Runtime ---
FROM node:20-alpine

WORKDIR /app

# Copy backend package files
COPY server/package*.json ./

# Install backend dependencies (production only)
RUN npm ci --only=production

# Copy backend source code
COPY server/ .

# Copy built frontend assets from Stage 1 to the backend's public folder
COPY --from=frontend-builder /app/dist ./public

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port
EXPOSE 3000

# Start the server
CMD ["node", "index.js"]
