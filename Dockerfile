# Multi-stage Dockerfile for production Next.js app
# Stage 1: install deps and build
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
COPY pnpm-lock.yaml* ./
RUN npm ci --omit=dev

# Copy sources and build
COPY . .
RUN npm run build

# Stage 2: production image
FROM node:20-alpine AS runner
WORKDIR /app

# Use a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy only necessary files from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/next.config.ts ./next.config.ts

ENV NODE_ENV=production
ENV PORT=3000

USER appuser
EXPOSE 3000

# Start the Next.js server
CMD ["node", "node_modules/next/dist/bin/next", "start", "-p", "3000"]
