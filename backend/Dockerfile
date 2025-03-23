FROM python:3.9-slim as base

# Set working directory
WORKDIR /app

# Install system dependencies including JDK
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    gcc \
    libc-dev \
    default-jdk \
    findutils && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Find and set the JVM path
RUN find /usr/lib/jvm -name "libjvm.so" | head -n 1 > /tmp/jvmpath.txt && \
    echo "export JVM_PATH=$(cat /tmp/jvmpath.txt)" >> /etc/profile && \
    echo "export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64" >> /etc/profile && \
    echo "JVM found at: $(cat /tmp/jvmpath.txt)"

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app \
    JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Set JVM path at runtime and print Hedera SDK info
CMD export JVM_PATH=$(find /usr/lib/jvm -name "libjvm.so" | head -n 1) && \
    echo "Using JVM at: $JVM_PATH" && \
    python -c "import hedera; print(f'Hedera SDK version: {hedera.__version__}'); print('Available classes:'); print(dir(hedera))" && \
    uvicorn app.main:app --host 0.0.0.0 --port 8000