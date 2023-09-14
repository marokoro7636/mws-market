# LTS version of node @ 2023-09-14
FROM node:18.17.1-alpine3.17

# Create working directory
WORKDIR /app

# Install Dependencies
COPY ./package.json /app/package.json
RUN npm install

# Copy source code
COPY . /app

CMD ["/bin/sh"]