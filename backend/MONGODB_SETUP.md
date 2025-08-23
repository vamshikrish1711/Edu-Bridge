# MongoDB Setup Guide for EduBridge

This guide will help you set up MongoDB for the EduBridge backend application.

## Prerequisites

1. MongoDB server installed (Homebrew on macOS: `brew install mongodb-community`)
2. Python dependencies installed: `pip install pymongo mongoengine dnspython`

## Step 1: Install MongoDB

### On macOS (using Homebrew):
```bash
# Install MongoDB Community Edition
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Check if MongoDB is running
brew services list | grep mongodb
```

### On Ubuntu/Debian:
```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod
```

### On Windows:
1. Download MongoDB Community Server from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Run the installer and follow the setup wizard
3. MongoDB will be installed as a service and started automatically

## Step 2: Verify MongoDB Installation

```bash
# Check MongoDB version
mongod --version

# Connect to MongoDB shell
mongosh

# In the MongoDB shell, test the connection
> show dbs
> exit
```

## Step 3: Configure Environment Variables

Create a `.env` file in the backend directory:

```bash
# Copy the template
cp env_template.txt .env
```

Edit the `.env` file and set:
```env
# MongoDB Configuration
MONGODB_HOST=localhost
MONGODB_PORT=27017
MONGODB_DATABASE=edubridge_db
MONGODB_USERNAME=
MONGODB_PASSWORD=

# Alternative: Use MONGODB_URI for direct connection string
# MONGODB_URI=mongodb://localhost:27017/edubridge_db
```

## Step 4: Install Python Dependencies

```bash
# Install MongoDB dependencies
pip install pymongo mongoengine dnspython

# Or install all requirements
pip install -r requirements.txt
```

## Step 5: Test MongoDB Connection

```bash
# Test the connection
python test_mongodb_connection.py
```

## Step 6: Initialize Database

```bash
# Run the seed data script
python seed_data_mongo.py
```

## Step 7: Start the Application

```bash
# Start the Flask application
python run.py
```

## MongoDB Atlas (Cloud Option)

If you prefer to use MongoDB Atlas (cloud-hosted MongoDB):

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update your `.env` file:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/edubridge_db?retryWrites=true&w=majority
```

## Database Collections

The application will create the following collections:

- `users` - User accounts and authentication
- `ngos` - NGO profiles and information
- `campaigns` - Fundraising campaigns
- `campaign_updates` - Campaign progress updates
- `donations` - Donation records
- `students` - Student profiles
- `mentors` - Mentor profiles
- `mentorships` - Mentorship relationships
- `scholarship_applications` - Scholarship applications

## Troubleshooting

### MongoDB Connection Issues

1. **MongoDB not running**: `brew services restart mongodb-community`
2. **Port issues**: Check if MongoDB is listening on port 27017
3. **Authentication issues**: Check username/password in connection string

### Common Commands

```bash
# Start MongoDB service
brew services start mongodb-community

# Stop MongoDB service
brew services stop mongodb-community

# Restart MongoDB service
brew services restart mongodb-community

# Check MongoDB status
brew services list | grep mongodb

# Connect to MongoDB shell
mongosh

# Show databases
show dbs

# Use database
use edubridge_db

# Show collections
show collections

# Find documents
db.users.find()

# Exit MongoDB shell
exit
```

### Reset MongoDB Data

```bash
# Connect to MongoDB shell
mongosh

# Switch to database
use edubridge_db

# Drop all collections
db.users.drop()
db.ngos.drop()
db.campaigns.drop()
db.donations.drop()
db.students.drop()
db.mentors.drop()
db.mentorships.drop()

# Exit
exit

# Re-seed data
python seed_data_mongo.py
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGODB_HOST` | `localhost` | MongoDB server host |
| `MONGODB_PORT` | `27017` | MongoDB server port |
| `MONGODB_DATABASE` | `edubridge_db` | Database name |
| `MONGODB_USERNAME` | - | MongoDB username (optional) |
| `MONGODB_PASSWORD` | - | MongoDB password (optional) |
| `MONGODB_URI` | - | Direct connection string (overrides other settings) |

## Production Considerations

For production deployment:

1. **Security**: Enable authentication and use strong passwords
2. **Backup**: Set up regular database backups
3. **Monitoring**: Use MongoDB monitoring tools
4. **Scaling**: Consider MongoDB Atlas or sharded clusters
5. **Indexes**: Create appropriate indexes for performance
6. **Environment Variables**: Use secure environment variables for credentials

## Performance Tips

1. **Indexes**: The application creates indexes on frequently queried fields
2. **Connection Pooling**: MongoEngine handles connection pooling automatically
3. **Query Optimization**: Use projection to limit returned fields
4. **Aggregation**: Use MongoDB aggregation pipeline for complex queries

## Backup and Restore

```bash
# Backup database
mongodump --db edubridge_db --out ./backup

# Restore database
mongorestore --db edubridge_db ./backup/edubridge_db
``` 