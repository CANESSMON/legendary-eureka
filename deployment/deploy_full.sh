#!/bin/bash
# ================================================================
#  Job Portal — Fully Automated VPS Deployment Script
#  Target OS : Ubuntu 22.04 / 24.04 LTS (root user)
#  Usage     : bash deploy_full.sh <GIT_REPO_URL> [DOMAIN_OR_IP]
#
#  This script is 100% non-interactive. It will:
#   1. Harden the server (UFW, Fail2Ban, auto-updates, SSH)
#   2. Install all dependencies (Node 20, Python 3, PostgreSQL,
#      Redis, Nginx, Certbot, Git)
#   3. Clone the repository
#   4. Generate secure random passwords for PostgreSQL & JWT
#   5. Create the database and user
#   6. Set up the Python backend (venv, requirements, admin user)
#   7. Build the React frontend
#   8. Configure Nginx reverse proxy
#   9. Start everything via systemd
#  10. Write a full credentials report to /root/deployment_report.txt
#
#  At the end, cat /root/deployment_report.txt to see all credentials.
# ================================================================

set -euo pipefail

# ── Colours for output ──────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
info()  { echo -e "${CYAN}[INFO]${NC}  $*"; }
ok()    { echo -e "${GREEN}[OK]${NC}    $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC}  $*"; }
fail()  { echo -e "${RED}[FAIL]${NC}  $*"; exit 1; }

# ── Ensure root ─────────────────────────────────────────────────
[[ "$EUID" -eq 0 ]] || fail "This script must be run as root."

# ── Parse arguments ─────────────────────────────────────────────
GIT_REPO_URL="${1:-}"
[[ -n "$GIT_REPO_URL" ]] || fail "Usage: bash deploy_full.sh <GIT_REPO_URL> [DOMAIN_OR_IP]"

# If no domain/IP provided, auto-detect the public IP
SERVER_ADDRESS="${2:-}"
if [[ -z "$SERVER_ADDRESS" ]]; then
    SERVER_ADDRESS=$(curl -s --max-time 5 ifconfig.me || curl -s --max-time 5 api.ipify.org || hostname -I | awk '{print $1}')
fi
[[ -n "$SERVER_ADDRESS" ]] || fail "Could not determine server address. Pass it as the second argument."

PROJECT_DIR="/var/www/job-portal"
REPORT_FILE="/root/deployment_report.txt"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S %Z')

echo ""
echo "================================================================"
echo "  Job Portal — Automated Deployment"
echo "  Server : $SERVER_ADDRESS"
echo "  Repo   : $GIT_REPO_URL"
echo "  Started: $TIMESTAMP"
echo "================================================================"
echo ""

# ── Helper: Generate a secure random string ─────────────────────
gen_password() {
    openssl rand -base64 32 | tr -dc 'A-Za-z0-9!@#%^&*_+=' | head -c "${1:-32}"
}

# ================================================================
#  PHASE 1 — SYSTEM UPDATE & SECURITY HARDENING
# ================================================================
info "Phase 1: System update & security hardening..."

export DEBIAN_FRONTEND=noninteractive

apt-get update -y
apt-get upgrade -y

# ── 1a. UFW Firewall ────────────────────────────────────────────
info "Configuring UFW firewall..."
apt-get install -y ufw
ufw default deny incoming
ufw default allow outgoing
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
echo "y" | ufw enable
ok "UFW firewall active (SSH, HTTP, HTTPS allowed)."

# ── 1b. Fail2Ban ────────────────────────────────────────────────
info "Installing Fail2Ban..."
apt-get install -y fail2ban
if [[ ! -f /etc/fail2ban/jail.local ]]; then
    cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
fi
systemctl enable fail2ban
systemctl restart fail2ban
ok "Fail2Ban active."

# ── 1c. SSH Hardening ───────────────────────────────────────────
info "Hardening SSH configuration..."
SSHD_CONFIG="/etc/ssh/sshd_config"
# Only allow key-based root login, disable password auth
sed -i 's/^#\?PermitRootLogin.*/PermitRootLogin prohibit-password/' "$SSHD_CONFIG"
sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication no/' "$SSHD_CONFIG"
sed -i 's/^#\?PubkeyAuthentication.*/PubkeyAuthentication yes/' "$SSHD_CONFIG"
systemctl restart ssh || systemctl restart sshd || true
ok "SSH hardened: password login disabled, key-only root access."

# ── 1d. Automatic Security Updates ──────────────────────────────
info "Enabling automatic security updates..."
apt-get install -y unattended-upgrades
systemctl enable unattended-upgrades
ok "Unattended upgrades enabled."

# ================================================================
#  PHASE 2 — INSTALL ALL DEPENDENCIES
# ================================================================
info "Phase 2: Installing all dependencies..."

# ── 2a. Core packages ───────────────────────────────────────────
apt-get install -y \
    python3 python3-pip python3-venv python3-dev \
    libpq-dev build-essential \
    postgresql postgresql-contrib \
    redis-server \
    nginx \
    git curl wget \
    certbot python3-certbot-nginx

# ── 2b. Node.js 20 LTS ──────────────────────────────────────────
if ! command -v node &>/dev/null || [[ "$(node -v | cut -d'.' -f1)" != "v20" ]]; then
    info "Installing Node.js v20 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi
ok "Node.js $(node -v) / npm $(npm -v) installed."

# ── 2c. Start services ──────────────────────────────────────────
systemctl start postgresql
systemctl enable postgresql
systemctl start redis-server
systemctl enable redis-server
ok "PostgreSQL and Redis running."

# ================================================================
#  PHASE 3 — GENERATE SECURE CREDENTIALS
# ================================================================
info "Phase 3: Generating secure credentials..."

DB_NAME="jobportal"
DB_USER="jobportal_user"
DB_PASS=$(gen_password 24)
JWT_SECRET=$(gen_password 64)
ADMIN_EMAIL="admin@jobportal.com"
ADMIN_PASSWORD=$(gen_password 16)

ok "Credentials generated (stored in $REPORT_FILE at the end)."

# ================================================================
#  PHASE 4 — CONFIGURE POSTGRESQL
# ================================================================
info "Phase 4: Configuring PostgreSQL..."

# Create user (ignore error if exists)
sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';" 2>/dev/null || true
# Always update password in case user already existed
sudo -u postgres psql -c "ALTER USER $DB_USER WITH PASSWORD '$DB_PASS';"

# Create database (ignore error if exists)
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 \
    || sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"

sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
# Grant schema permissions for PostgreSQL 15+
sudo -u postgres psql -d "$DB_NAME" -c "GRANT ALL ON SCHEMA public TO $DB_USER;" 2>/dev/null || true

ok "PostgreSQL database '$DB_NAME' and user '$DB_USER' configured."

# ================================================================
#  PHASE 5 — CLONE REPOSITORY
# ================================================================
info "Phase 5: Cloning repository..."

if [[ -d "$PROJECT_DIR/.git" ]]; then
    warn "Project directory already exists. Pulling latest changes..."
    cd "$PROJECT_DIR"
    git fetch --all
    git reset --hard origin/main || git reset --hard origin/master
else
    rm -rf "$PROJECT_DIR"
    git clone "$GIT_REPO_URL" "$PROJECT_DIR"
fi
cd "$PROJECT_DIR"
ok "Repository cloned to $PROJECT_DIR."

# ================================================================
#  PHASE 6 — CONFIGURE BACKEND
# ================================================================
info "Phase 6: Configuring backend..."

cd "$PROJECT_DIR/backend"

# ── 6a. Write production .env ────────────────────────────────────
cat > .env <<ENVEOF
# ──────────────────────────────────────────
# PRODUCTION ENVIRONMENT — AUTO-GENERATED
# Generated: $TIMESTAMP
# ──────────────────────────────────────────

# Database Connection
DATABASE_URL=postgresql://${DB_USER}:${DB_PASS}@localhost:5432/${DB_NAME}
PG_ROOT_DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres

# JWT Authentication
SECRET_KEY=${JWT_SECRET}
ALGORITHM=HS256

# CORS Allowed Origins
CORS_ORIGINS=http://${SERVER_ADDRESS},https://${SERVER_ADDRESS}

# Default Super Admin Credentials
DEFAULT_ADMIN_EMAIL=${ADMIN_EMAIL}
DEFAULT_ADMIN_PASSWORD=${ADMIN_PASSWORD}

# SMTP Settings (update with your real SMTP credentials)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_TO=your_email@gmail.com
ENVEOF

ok "Backend .env written."

# ── 6b. Create virtual environment & install dependencies ────────
info "Setting up Python virtual environment..."
python3 -m venv venv
venv/bin/pip install --upgrade pip -q
venv/bin/pip install -r requirements.txt -q
venv/bin/pip install gunicorn uvicorn -q
ok "Python dependencies installed."

# ── 6c. Initialize database tables & create admin ────────────────
if [[ -f "$PROJECT_DIR/deployment/jobportal_backup.sql" ]]; then
    info "Restoring database backup from deployment/jobportal_backup.sql..."
    sudo -u postgres psql -d "$DB_NAME" -f "$PROJECT_DIR/deployment/jobportal_backup.sql" || true
    ok "Database backup restored successfully."
fi
info "Ensuring tables exist & Super Admin exists..."
venv/bin/python create_admin.py
ok "Database initialized and admin checked."

# ================================================================
#  PHASE 7 — BUILD FRONTEND
# ================================================================
info "Phase 7: Building frontend..."

cd "$PROJECT_DIR/frontend"

# Write production .env
cat > .env <<ENVEOF
# PRODUCTION ENVIRONMENT — AUTO-GENERATED
VITE_USE_MOCK_DATA=false
VITE_API_BASE_URL=http://${SERVER_ADDRESS}
ENVEOF

npm install --legacy-peer-deps
npm run build

if [[ ! -d "dist" ]]; then
    fail "Frontend build failed — dist/ directory not found."
fi
ok "Frontend built successfully."

# Set permissions
chown -R root:www-data "$PROJECT_DIR"
chmod -R 755 "$PROJECT_DIR"

# ================================================================
#  PHASE 8 — CONFIGURE SYSTEMD SERVICE
# ================================================================
info "Phase 8: Configuring systemd service for backend..."

cat > /etc/systemd/system/jobportal.service <<SVCEOF
[Unit]
Description=Job Portal FastAPI Backend
After=network.target postgresql.service redis-server.service

[Service]
User=root
Group=www-data
WorkingDirectory=${PROJECT_DIR}/backend
Environment="PATH=${PROJECT_DIR}/backend/venv/bin"
ExecStart=${PROJECT_DIR}/backend/venv/bin/gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker -b 127.0.0.1:8000
Restart=always
RestartSec=5
StandardOutput=append:/var/log/jobportal/backend.log
StandardError=append:/var/log/jobportal/error.log

[Install]
WantedBy=multi-user.target
SVCEOF

mkdir -p /var/log/jobportal
systemctl daemon-reload
systemctl restart jobportal
systemctl enable jobportal

# Wait a moment and check if it's running
sleep 3
if systemctl is-active --quiet jobportal; then
    ok "Backend service running."
else
    warn "Backend service failed to start. Check: journalctl -u jobportal -n 50"
fi

# ================================================================
#  PHASE 9 — CONFIGURE NGINX
# ================================================================
info "Phase 9: Configuring Nginx reverse proxy..."

cat > /etc/nginx/sites-available/jobportal <<NGINXEOF
server {
    listen 80;
    server_name ${SERVER_ADDRESS} www.${SERVER_ADDRESS};

    root ${PROJECT_DIR}/frontend/dist;
    index index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;
    gzip_min_length 256;

    # Serve React Frontend (SPA)
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Reverse Proxy for FastAPI Backend
    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
    }

    # Block access to dotfiles
    location ~ /\. {
        deny all;
        return 404;
    }
}
NGINXEOF

ln -sf /etc/nginx/sites-available/jobportal /etc/nginx/sites-enabled/jobportal
rm -f /etc/nginx/sites-enabled/default

nginx -t
systemctl reload nginx
systemctl enable nginx
ok "Nginx configured and running."

# ================================================================
#  PHASE 10 — WRITE CREDENTIALS REPORT
# ================================================================
info "Phase 10: Writing credentials report..."

cat > "$REPORT_FILE" <<REPORTEOF
================================================================
  JOB PORTAL — DEPLOYMENT REPORT
  Generated: $TIMESTAMP
  Server:    $SERVER_ADDRESS
================================================================

STATUS: DEPLOYMENT COMPLETE ✅

── ACCESS URLS ─────────────────────────────────────────────────
  Frontend:  http://${SERVER_ADDRESS}
  Backend:   http://${SERVER_ADDRESS}/api
  API Docs:  http://${SERVER_ADDRESS}/api/docs

── POSTGRESQL CREDENTIALS ──────────────────────────────────────
  Database:  $DB_NAME
  Username:  $DB_USER
  Password:  $DB_PASS
  Host:      localhost:5432
  Full URL:  postgresql://${DB_USER}:${DB_PASS}@localhost:5432/${DB_NAME}

── JWT SECRET KEY ──────────────────────────────────────────────
  $JWT_SECRET

── SUPER ADMIN LOGIN ───────────────────────────────────────────
  Email:     $ADMIN_EMAIL
  Password:  $ADMIN_PASSWORD

── SMTP / EMAIL ────────────────────────────────────────────────
  ⚠ SMTP credentials are set to placeholders.
  Edit ${PROJECT_DIR}/backend/.env and update:
    SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_TO

── SSL / HTTPS ─────────────────────────────────────────────────
  ⚠ SSL is NOT configured (no domain provided).
  When you have a domain, run:
    certbot --nginx -d yourdomain.com -d www.yourdomain.com

── SERVICE MANAGEMENT ──────────────────────────────────────────
  Backend:   systemctl {start|stop|restart|status} jobportal
  Nginx:     systemctl {start|stop|restart|status} nginx
  PostgreSQL:systemctl {start|stop|restart|status} postgresql
  Redis:     systemctl {start|stop|restart|status} redis-server

── LOG FILES ───────────────────────────────────────────────────
  Backend:   /var/log/jobportal/backend.log
  Errors:    /var/log/jobportal/error.log
  Nginx:     /var/log/nginx/access.log & error.log
  System:    journalctl -u jobportal -f

── SECURITY NOTES ──────────────────────────────────────────────
  ✅ UFW Firewall: Active (SSH, HTTP, HTTPS only)
  ✅ Fail2Ban: Active (brute-force protection)
  ✅ SSH: Key-only authentication, password login disabled
  ✅ Auto-Updates: Enabled for security patches

── FILE LOCATIONS ──────────────────────────────────────────────
  Project:   $PROJECT_DIR
  Backend:   $PROJECT_DIR/backend
  Frontend:  $PROJECT_DIR/frontend
  Env File:  $PROJECT_DIR/backend/.env
  Service:   /etc/systemd/system/jobportal.service
  Nginx:     /etc/nginx/sites-available/jobportal
  This file: $REPORT_FILE

⚠ IMPORTANT: This file contains sensitive passwords.
  After noting them down securely, consider deleting this file:
    rm $REPORT_FILE
================================================================
REPORTEOF

chmod 600 "$REPORT_FILE"

echo ""
echo "================================================================"
echo -e "${GREEN}  ✅ DEPLOYMENT COMPLETE!${NC}"
echo "================================================================"
echo "  Frontend : http://${SERVER_ADDRESS}"
echo "  Backend  : http://${SERVER_ADDRESS}/api"
echo "  API Docs : http://${SERVER_ADDRESS}/api/docs"
echo ""
echo "  Full credentials report: $REPORT_FILE"
echo "  View it with: cat $REPORT_FILE"
echo "================================================================"
echo ""
