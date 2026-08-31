#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Define standard project directory
PROJECT_DIR="/var/www/job-portal"

# Ensure script is run as root
if [ "$EUID" -ne 0 ]; then
  echo "Please run this script as root (using sudo)."
  exit 1
fi

echo "=================================================="
echo " Starting Job Portal Automated VPS Installer"
echo "=================================================="

# Prompt for domain name
DOMAIN_NAME=$1
if [ -z "$DOMAIN_NAME" ]; then
    read -p "Enter your domain name (e.g. yourdomain.com): " DOMAIN_NAME
fi

if [ -z "$DOMAIN_NAME" ]; then
    echo "Error: Domain name is required."
    exit 1
fi

echo "Deploying for domain: $DOMAIN_NAME"
echo "Project path: $PROJECT_DIR"

# 1. Update OS packages
echo "Updating package list..."
apt-get update -y

# 2. Install Node.js v20 (LTS) if not already installed
if ! command -v node &> /dev/null || [ $(node -v | cut -d'.' -f1) != "v20" ]; then
    echo "Installing Node.js v20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi
echo "Node.js version: $(node -v)"
echo "NPM version: $(npm -v)"

# 3. Install core dependencies (Python, PostgreSQL, Redis, Nginx, Certbot)
echo "Installing system dependencies..."
apt-get install -y python3 python3-pip python3-venv python3-dev libpq-dev postgresql postgresql-contrib redis-server nginx git curl certbot python3-certbot-nginx

# 4. Start and enable PostgreSQL and Redis services
echo "Configuring PostgreSQL and Redis..."
systemctl start postgresql
systemctl enable postgresql
systemctl start redis-server
systemctl enable redis-server

# 5. Extract PostgreSQL credentials from backend/.env
if [ ! -f "$PROJECT_DIR/backend/.env" ]; then
    echo "Error: backend/.env not found! Please create it first before running this script."
    exit 1
fi

echo "Parsing database credentials from backend/.env..."
# Use Python to safely parse DATABASE_URL
read DB_USER DB_PASS DB_NAME <<< $(python3 -c '
import re
try:
    content = open("'"$PROJECT_DIR"'/backend/.env").read()
    m = re.search(r"DATABASE_URL=postgresql://([^:]+):([^@]+)@[^/:]+(?::\d+)?/([^\s\?]+)", content)
    if m:
        print(f"{m.group(1)} {m.group(2)} {m.group(3)}")
except Exception as e:
    pass
')

if [ -n "$DB_USER" ] && [ -n "$DB_PASS" ] && [ -n "$DB_NAME" ]; then
    echo "Configuring PostgreSQL database '$DB_NAME' and user '$DB_USER'..."
    # Create database user
    sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';" 2>/dev/null || echo "User '$DB_USER' already exists."
    sudo -u postgres psql -c "ALTER USER $DB_USER WITH PASSWORD '$DB_PASS';"
    
    # Create database if it does not exist
    sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
else
    echo "Warning: Could not parse DATABASE_URL from backend/.env. Setup database manually."
fi

# 6. Backend setup
echo "Setting up backend Python environment..."
cd "$PROJECT_DIR/backend"
python3 -m venv venv
venv/bin/pip install --upgrade pip
venv/bin/pip install -r requirements.txt
venv/bin/pip install gunicorn uvicorn

# Create Super Admin if not already existing
echo "Creating default Super Admin user..."
venv/bin/python create_admin.py

# 7. Configure and start Gunicorn systemd service
echo "Configuring systemd service..."
cp "$PROJECT_DIR/deployment/jobportal.service" /etc/systemd/system/jobportal.service

# Reload daemon and restart service
systemctl daemon-reload
systemctl restart jobportal
systemctl enable jobportal
echo "Backend service status: $(systemctl is-active jobportal)"

# 8. Frontend setup and compilation
echo "Building React frontend..."
cd "$PROJECT_DIR/frontend"
npm install
npm run build

# Ensure folders and static files are readable by www-data
chown -R root:www-data "$PROJECT_DIR"
chmod -R 755 "$PROJECT_DIR"

# 9. Configure Nginx
echo "Configuring Nginx site..."
cp "$PROJECT_DIR/deployment/nginx.conf" /etc/nginx/sites-available/jobportal

# Replace placeholder domain with actual domain
sed -i "s/{{DOMAIN_NAME}}/$DOMAIN_NAME/g" /etc/nginx/sites-available/jobportal

# Enable the configuration in Nginx
ln -sf /etc/nginx/sites-available/jobportal /etc/nginx/sites-enabled/jobportal

# Disable the default site if it exists
rm -f /etc/nginx/sites-enabled/default

# Test and reload Nginx
echo "Testing Nginx configuration..."
nginx -t
systemctl reload nginx

echo "=================================================="
echo " Deployment script completed successfully!"
echo " Your application is now running on http://$DOMAIN_NAME"
echo "=================================================="
echo " To enable SSL/HTTPS, please run:"
echo " sudo certbot --nginx -d $DOMAIN_NAME -d www.$DOMAIN_NAME"
echo "=================================================="
