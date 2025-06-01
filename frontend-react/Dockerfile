
# Stage 1: Build the React app using Vite
FROM node:24-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY frontend-react/package.json frontend-react/package-lock.json* ./

RUN npm install

# Copy the rest of the app source code
COPY frontend-react/ ./

# Build the app (creates the /dist folder)
RUN npm run build

# Stage 2: Serve the built app using Nginx
FROM nginx:alpine

# Remove default Nginx static content
RUN rm -rf /usr/share/nginx/html/*

# Copy built frontend from previous stage
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Optional: Use custom nginx.conf
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 for HTTP
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
