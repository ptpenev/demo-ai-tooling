FROM node:22-alpine AS builder
WORKDIR /app

# Copy root package files
COPY package.json package-lock.json ./
# Copy workspace package files
COPY apps/api/package.json ./apps/api/

# Install dependencies for the api workspace
RUN npm install

# Copy source code
COPY . .

# Build the API
WORKDIR /app/apps/api
RUN npm run build

FROM node:22-alpine AS production
WORKDIR /app

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist

WORKDIR /app/apps/api
EXPOSE 3000

CMD ["npm", "run", "start:prod"]
