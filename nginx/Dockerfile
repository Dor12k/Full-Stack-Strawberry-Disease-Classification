

# nginx/Dockerfile

# Use official nginx Alpine image for smaller size
FROM nginx:alpine

# Copy custom nginx configuration (you can create nginx.conf if needed)
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

# Copy React build files to nginx public folder
COPY ./frontend-react/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx (already the default CMD)
CMD ["nginx", "-g", "daemon off;"]
