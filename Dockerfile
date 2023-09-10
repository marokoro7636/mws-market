FROM ubuntu:22.04

# Initial setup

RUN apt-get update && apt-get install -y \
    curl \
    git \
    build-essential \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Python
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-dev \
    libssl-dev \
    libffi-dev \
    python3-setuptools \
    python3-venv \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Nodejs

# RUN apt-get update && apt-get install -y \
#     nodejs \
#     npm \
#     && apt-get clean \
#     && rm -rf /var/lib/apt/lists/*

# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# Create working directory
WORKDIR /app

# Install Dependencies

# Python dependencies

COPY ./requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Nodejs dependencies

# COPY ./package.json /app/package.json
# RUN npm install

# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]

CMD ["bash"]