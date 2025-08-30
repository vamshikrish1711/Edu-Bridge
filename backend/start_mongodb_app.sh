#!/bin/bash

# Start EduBridge Flask App with MongoDB
echo "🚀 Starting EduBridge with MongoDB..."

# Set MongoDB environment variables
export MONGODB_URI="mongodb://localhost:27017/edubridge_db"
export MONGODB_DATABASE="edubridge_db"
export MONGODB_HOST="localhost"
export MONGODB_PORT="27017"

echo "✅ MongoDB environment variables set:"
echo "   MONGODB_URI: $MONGODB_URI"
echo "   MONGODB_DATABASE: $MONGODB_DATABASE"

# Check if MongoDB is running
if brew services list | grep -q "mongodb-community.*started"; then
    echo "✅ MongoDB is running"
else
    echo "❌ MongoDB is not running. Starting it..."
    brew services start mongodb-community
    sleep 3
fi

# Start the Flask application
echo "🌐 Starting Flask application on port 5001..."
python run.py
