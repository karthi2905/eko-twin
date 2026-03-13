# ---- Backend Builder ----
FROM python:3.11-slim

WORKDIR /app

# Copy Requirements
COPY requirements.txt .

# Install Dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy Backend Code
COPY . .

# Expose Port
EXPOSE 8000

# Start Application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
