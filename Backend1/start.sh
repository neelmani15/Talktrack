#!/bin/bash

# Start Xvfb
Xvfb :99 -screen 0 1024x768x16 &

# Export DISPLAY variable
export DISPLAY=:99

# Start the Node.js application
node index.js
