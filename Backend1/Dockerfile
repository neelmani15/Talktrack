FROM node:latest

# Update the package list and install wget
RUN apt-get update && apt-get install -y wget gnupg

# Add Google's public key and setup the repository
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/google-chrome.gpg 
RUN echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-chrome.gpg] http://dl.google.com/linux/chrome/deb/ stable main" | tee /etc/apt/sources.list.d/google-chrome.list

# Update the package list again and install Google Chrome
RUN apt-get update && apt-get install -y google-chrome-stable

# Install Xvfb to run Chrome in a headless mode
RUN apt-get install -y xvfb

# Set environment variable for display
# ENV DISPLAY=:99

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and install npm dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port the app runs on
EXPOSE 5001

# Start Xvfb and then the node application
CMD ["./start.sh"]