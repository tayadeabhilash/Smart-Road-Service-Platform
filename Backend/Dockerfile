# Use a base image
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy application code
COPY . .

# Install dependencies
RUN pip install -r requirements.txt

# Expose the application port
EXPOSE 5000

# Run the application
CMD ["python", "app.py"]