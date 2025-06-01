


# Use official Python image with specific platform for compatibility (especially on Mac M1/M2 or AWS x86)
FROM --platform=linux/amd64 python:3.11-slim

# Prevent Python from buffering stdout/stderr 
ENV PYTHONUNBUFFERED=1

# Set working directory inside the container
WORKDIR /django

# Copy only requirements first for better caching of dependencies
COPY requirements.txt .

# Upgrade pip and install dependencies
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Copy the rest of the backend source code into the container
COPY . .

# Expose port 8000 to communicate with outside world (default Django port)
EXPOSE 8000

# Run Gunicorn server to serve the Django application
CMD ["gunicorn", "backend_main.wsgi:application", "--bind", "0.0.0.0:8000"]


