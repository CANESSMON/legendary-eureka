# Job Portal VPS Deployment Guide

This folder contains the automation scripts and configuration templates required to host the **Job Portal** application on your Hostinger Ubuntu VPS.

## 🏗️ Deployment Architecture
- **OS**: Ubuntu (22.04 LTS or 24.04 LTS)
- **Frontend**: React + Vite (Compiled and served statically by Nginx)
- **Backend API**: FastAPI (Run via Gunicorn + Uvicorn workers as a Systemd service)
- **Database**: PostgreSQL (Relational DB)
- **Cache**: Redis (Fast in-memory cache)
- **Reverse Proxy / SSL**: Nginx + Let's Encrypt (Certbot)

---

## 🚦 Step-by-Step Deployment Instructions

### Step 1: Configure Your Domain DNS (On Hostinger/Domain Registrar)
To get your application live on your domain name, you must point it to your VPS.
1. Log in to your Hostinger dashboard (or your domain registrar).
2. Go to **DNS Zone Editor** for your domain.
3. Add/update the following DNS Records:
   - **Type A**: Host: `@`, Value: `YOUR_VPS_IP`
   - **Type A**: Host: `www`, Value: `YOUR_VPS_IP`

*Note: DNS propagation can take anywhere from a few minutes to 24 hours.*

---

### Step 2: Access Your VPS via SSH
Open your terminal (PowerShell, Command Prompt, or Git Bash on Windows, or Terminal on macOS/Linux) and connect to your VPS:
```bash
ssh root@YOUR_VPS_IP
```
*(Enter your VPS root password when prompted)*

---

### Step 3: Install Git and Clone the Repository
On your VPS, check if Git is installed, and clone the repository directly to the standard directory `/var/www/job-portal`:

1. Create the parent directory and change owner:
   ```bash
   sudo mkdir -p /var/www/job-portal
   sudo chown -R ubuntu:ubuntu /var/www/job-portal  # Replace 'ubuntu' with your VPS username if not root
   ```
   *(If you are logged in as `root`, you can keep ownership as `root:root` or create a deployment user)*

2. Clone your repository:
   ```bash
   git clone https://github.com/CANESSMON/legendary-eureka.git /var/www/job-portal
   ```
3. Navigate to the project directory:
   ```bash
   cd /var/www/job-portal
   ```

---

### Step 4: Configure Environment Files (`.env`)
Before running the deployment script, we need to create the production `.env` files.

1. **Configure Backend Environment**:
   Create and open the backend `.env` file:
   ```bash
   nano backend/.env
   ```
   Add the following values, making sure to replace placeholder passwords with strong, random strings:
   ```ini
   DATABASE_URL=postgresql://jobportal_user:YOUR_STRONG_PASSWORD@localhost:5432/jobportal
   PG_ROOT_DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
   SECRET_KEY=YOUR_LONG_RANDOM_SECRET_KEY_FOR_JWT
   ALGORITHM=HS256
   CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
   DEFAULT_ADMIN_EMAIL=admin@yourdomain.com
   DEFAULT_ADMIN_PASSWORD=YourSecureAdminPassword123!
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=YOUR_SMTP_EMAIL@gmail.com
   SMTP_PASS=YOUR_SMTP_APP_PASSWORD
   SMTP_TO=YOUR_SMTP_EMAIL@gmail.com
   ```
   *Press `Ctrl+O`, `Enter` to save, and `Ctrl+X` to exit nano.*

2. **Configure Frontend Environment**:
   Create and open the frontend `.env` file:
   ```bash
   nano frontend/.env
   ```
   Add the production base URL (your domain name):
   ```ini
   VITE_USE_MOCK_DATA=false
   VITE_API_BASE_URL=https://yourdomain.com
   ```
   *Press `Ctrl+O`, `Enter` to save, and `Ctrl+X` to exit nano.*

---

### Step 5: Run the Deployment Automation Script
Run the automated installation script. It will install all system packages, configure PostgreSQL/Redis databases, compile the React build, and configure the Nginx/Systemd services.

1. Make the script executable:
   ```bash
   chmod +x deployment/deploy.sh
   ```
2. Execute the script with `sudo`:
   ```bash
   sudo ./deployment/deploy.sh
   ```
3. The script will ask you for your **Domain Name** (e.g. `yourdomain.com`). Enter it and let the installer complete.

---

### Step 6: Set Up SSL (HTTPS) with Let's Encrypt
Once Nginx is configured and running, secure your application with a free Let's Encrypt SSL certificate.

1. Run Certbot for Nginx:
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```
2. Follow the prompts. Certbot will automatically issue the certificates, modify your Nginx config to enable SSL, and redirect HTTP to HTTPS.

---

## 🛠️ Maintenance and Update Commands

When you push new changes to GitHub and want to update the live application:

1. Log in to the VPS and run:
   ```bash
   cd /var/www/job-portal
   git pull origin main
   ```
2. Re-run the deploy script or run a clean rebuild:
   ```bash
   sudo ./deployment/deploy.sh
   ```
3. To check logs:
   - Backend API: `sudo journalctl -u jobportal -f`
   - Nginx errors: `sudo tail -f /var/log/nginx/error.log`
