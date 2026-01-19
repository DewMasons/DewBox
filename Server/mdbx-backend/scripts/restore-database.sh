#!/bin/bash
# ============================================
# DATABASE RESTORE SCRIPT
# ============================================
# Restore database from backup
# Usage: ./restore-database.sh /path/to/backup_20260114_020000.sql.gz

set -e  # Exit on error

# Check if backup file provided
if [ -z "$1" ]; then
  echo "❌ Error: No backup file specified"
  echo "Usage: $0 /path/to/backup_file.sql.gz"
  exit 1
fi

BACKUP_FILE="$1"

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
  echo "❌ Error: Backup file not found: $BACKUP_FILE"
  exit 1
fi

# Configuration
DB_NAME="${DB_NAME:-railway}"
DB_HOST="${DB_HOST:-centerbeam.proxy.rlwy.net}"
DB_PORT="${DB_PORT:-43916}"
DB_USER="${DB_USERNAME:-root}"
DB_PASS="${DB_PASSWORD}"

echo "⚠️  WARNING: This will restore the database from backup"
echo "📁 Backup file: $BACKUP_FILE"
echo "🗄️  Database: $DB_NAME"
echo "🌐 Host: $DB_HOST"
echo ""
read -p "Are you sure you want to continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
  echo "❌ Restore cancelled"
  exit 0
fi

# Stop application (if using PM2)
if command -v pm2 &> /dev/null; then
  echo "🛑 Stopping application..."
  pm2 stop mdbx-backend || true
fi

# Create pre-restore backup
echo "📦 Creating pre-restore backup..."
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
mysqldump -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" \
  --single-transaction \
  --databases "$DB_NAME" | gzip > "/backups/mysql/pre_restore_$TIMESTAMP.sql.gz"
echo "✅ Pre-restore backup created: pre_restore_$TIMESTAMP.sql.gz"

# Verify backup file integrity
echo "🔍 Verifying backup file..."
gunzip -t "$BACKUP_FILE"

if [ $? -ne 0 ]; then
  echo "❌ Backup file is corrupted!"
  exit 1
fi

echo "✅ Backup file verified"

# Restore database
echo "🔄 Restoring database..."
gunzip < "$BACKUP_FILE" | mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS"

if [ $? -eq 0 ]; then
  echo "✅ Database restored successfully"
else
  echo "❌ Database restore failed!"
  echo "⚠️  Attempting to restore from pre-restore backup..."
  gunzip < "/backups/mysql/pre_restore_$TIMESTAMP.sql.gz" | \
    mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS"
  exit 1
fi

# Verify restoration
echo "🔍 Verifying restoration..."
RECORD_COUNT=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" \
  -e "SELECT COUNT(*) FROM user;" "$DB_NAME" -sN)

echo "📊 User records found: $RECORD_COUNT"

if [ "$RECORD_COUNT" -gt 0 ]; then
  echo "✅ Restoration verified"
else
  echo "⚠️  Warning: No user records found. Database may be empty."
fi

# Restart application
if command -v pm2 &> /dev/null; then
  echo "🚀 Restarting application..."
  pm2 start mdbx-backend
fi

echo "✅ Database restore completed at $(date)"
echo "📁 Restored from: $BACKUP_FILE"
echo "💾 Pre-restore backup: /backups/mysql/pre_restore_$TIMESTAMP.sql.gz"

exit 0
