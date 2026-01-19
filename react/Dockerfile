# --------- Base stage (common setup) ----------
FROM node:18-alpine AS base

WORKDIR /app

# Accept build-time variables
ARG VITE_BACKEND_PORT
ARG VITE_PORT
ARG VITE_BUILD_STAGE
ARG VITE_HOST
ARG VITE_UPLOAD_PASSCODE

# Set them as environment so Vite can read
ENV VITE_BACKEND_PORT=$VITE_BACKEND_PORT
ENV VITE_PORT=$VITE_PORT
ENV VITE_BUILD_STAGE=$VITE_BUILD_STAGE
ENV VITE_HOST=$VITE_HOST
ENV VITE_UPLOAD_PASSCODE=$VITE_UPLOAD_PASSCODE

# Install deps early to cache layers
COPY package*.json tsconfig*.json ./
RUN npm install

# Copy source files
COPY . .

# --------- Development stage ----------
FROM base AS development

# Expose Vite dev port
EXPOSE 5173

# Enable Vite HMR over Docker
ENV HOST=0.0.0.0

# Start Vite dev server
CMD ["npm", "run", "dev"]

# --------- Build stage ----------
FROM base AS build

# Build the static site (dist/)
RUN npm run build

# --------- Production stage ----------
FROM nginx:stable-alpine AS production

# Copy built site to nginx public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Optional: custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]
