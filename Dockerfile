# ---------- Build stage ----------
FROM node:18-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install
RUN npm install react-icons

# Copy source and build
COPY . .
RUN npm run build

# ---------- Production stage ----------
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Remove default nginx static files
RUN rm -rf ./*

# Copy build from previous stage
COPY --from=build /app/build .

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
