# Simplified Docker Build for Production
FROM python:3.11-slim

# Set shell options for pipefail
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# Create non-root user first
RUN groupadd -g 1001 appuser && \
    useradd -r -u 1001 -g appuser appuser

# Set working directory
WORKDIR /app

# Install system dependencies (minimal set)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency files first for better layer caching
COPY requirements.txt ./

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY --chown=appuser:appuser . .

# Build frontend assets if package.json exists
RUN if [ -f "package.json" ]; then \
        apt-get update && apt-get install -y --no-install-recommends nodejs npm && \
        npm ci && \
        npm run build && \
        apt-get remove -y nodejs npm && \
        apt-get autoremove -y && \
        rm -rf /var/lib/apt/lists/*; \
    fi

# Change ownership to non-root user
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 5000

# Set environment variables
ENV FLASK_APP=run.py
ENV FLASK_ENV=production
ENV PYTHONPATH=/app

# Start application
CMD ["python", "run.py"]
