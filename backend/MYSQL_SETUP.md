# MySQL Setup Guide for EduBridge

This guide will help you set up MySQL for the EduBridge backend application.

## Prerequisites

1. MySQL server installed (Homebrew on macOS: `brew install mysql`)
2. Python dependencies installed: `pip install PyMySQL cryptography`

## Step 1: Start MySQL Service

```bash
# Start MySQL service
brew services start mysql

# Check if MySQL is running
brew services list | grep mysql
```

## Step 2: Create Database and User

### Option A: Using the Setup Script

```bash
# Run the MySQL setup script
python setup_mysql.py
```

### Option B: Manual Setup

Connect to MySQL as root:
```bash
mysql -u root
```

Then run these SQL commands:
```sql
-- Create database
CREATE DATABASE IF NOT EXISTS edubridge_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user
CREATE USER IF NOT EXISTS 'edubridge_user'@'localhost' IDENTIFIED BY 'edubridge_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON edubridge_db.* TO 'edubridge_user'@'localhost';
GRANT ALL PRIVILEGES ON edubridge_db.* TO 'edubridge_user'@'%';

-- Flush privileges
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

## Step 3: Configure Environment Variables

Create a `.env` file in the backend directory:

```bash
# Copy the template
cp env_template.txt .env
```

Edit the `.env` file and set:
```env
# Enable MySQL
USE_MYSQL=true

# MySQL Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=edubridge_user
MYSQL_PASSWORD=edubridge_password
MYSQL_DATABASE=edubridge_db
```

## Step 4: Test MySQL Connection

```bash
# Test the connection
python test_mysql_connection.py
```

## Step 5: Initialize Database

```bash
# Run the seed data script
python seed_data.py
```

## Step 6: Start the Application

```bash
# Start the Flask application
python run.py
```

## Troubleshooting

### MySQL Connection Issues

1. **MySQL not running**: `brew services restart mysql`
2. **Access denied**: Check if MySQL is running in safe mode
3. **Port issues**: Check if MySQL is listening on port 3306

### Reset MySQL Root Password

If you need to reset the MySQL root password:

```bash
# Stop MySQL
brew services stop mysql

# Start MySQL in safe mode
mysqld_safe --skip-grant-tables --skip-networking &

# Connect to MySQL
mysql -u root

# Reset password
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
EXIT;

# Stop safe mode and restart normally
pkill -f mysqld_safe
brew services start mysql
```

### Using SQLite Instead

If you prefer to use SQLite (easier setup):

```bash
# Set environment variable to use SQLite
export USE_MYSQL=false

# Or edit .env file
echo "USE_MYSQL=false" >> .env
```

## Database Configuration Options

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `USE_MYSQL` | `false` | Enable MySQL (true) or SQLite (false) |
| `MYSQL_HOST` | `localhost` | MySQL server host |
| `MYSQL_PORT` | `3306` | MySQL server port |
| `MYSQL_USER` | `edubridge_user` | MySQL username |
| `MYSQL_PASSWORD` | `edubridge_password` | MySQL password |
| `MYSQL_DATABASE` | `edubridge_db` | MySQL database name |

### Connection Strings

- **MySQL**: `mysql+pymysql://user:password@host:port/database`
- **SQLite**: `sqlite:///database.db`

## Production Considerations

For production deployment:

1. Use strong passwords
2. Configure MySQL security settings
3. Set up proper backup procedures
4. Use environment variables for sensitive data
5. Consider using a managed MySQL service (AWS RDS, Google Cloud SQL, etc.) 