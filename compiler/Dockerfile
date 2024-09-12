FROM node:18-alpine
# Set working directory
WORKDIR /app

# Update and install necessary packages

#  openjdk11-jre: This installs the Java Runtime Environment (JRE) version 11.
#  python3, python3-dev, and py3-pip: These install Python 3, the Python development headers, and pip (Python package installer).
#  make: This is often required for building native extensions or for use in compiling software

RUN apk update && apk add --no-cache \
g++ \
gcc \
openjdk11 \
python3 \
python3-dev \
py3-pip \
make

# Copy package.json and install dependencies
COPY package.json .
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the application port
EXPOSE 4000

# Define the command to run the application
CMD ["node","App.js"]
