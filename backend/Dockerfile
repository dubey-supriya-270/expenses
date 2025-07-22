# Stage 1: Install deps & compile
FROM node:18-alpine AS builder
WORKDIR /app

# Install all dependencies (including dev)
COPY package*.json ./
RUN npm ci

# Copy source & tsconfig
COPY tsconfig.json tsconfig.build.json ./
COPY src ./src

# Build to dist/
RUN npm run build

# Stage 2: Production image
FROM node:18-alpine AS runner
WORKDIR /app

# Only pull in production deps
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled output
COPY --from=builder /app/dist ./dist

# Trust proxy etc if you need (same env as dev)
ENV NODE_ENV=production
EXPOSE 3000

# Run your compiled server
CMD ["--import=specifier-resolution-node/register", "dist/index.js"]
