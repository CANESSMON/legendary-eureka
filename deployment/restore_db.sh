#!/bin/bash
# Restore script for JobPortal PostgreSQL Database
set -e

BACKUP_FILE="${1:-/root/all-works/legendary-eureka/deployment/jobportal_backup.sql}"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: Backup file $BACKUP_FILE does not exist!"
    exit 1
fi

echo "Stopping jobportal backend service..."
systemctl stop jobportal || true

echo "Restoring PostgreSQL database from $BACKUP_FILE..."
sudo -u postgres psql -d jobportal -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
sudo -u postgres psql -d jobportal < "$BACKUP_FILE"

echo "Starting jobportal backend service..."
systemctl start jobportal

echo "Database successfully restored from $BACKUP_FILE!"
