#!/bin/bash
# ============================================
# DATABASE BACKUP SCRIPT
# ============================================
# Automated backup with cloud upload and verification
# Schedule with cron: 0 2 * * * /path/to/backup-database.sh

set -e  # Exit on error

# Configuration
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/backups/mysql"
DB_NAME="${DB_NAME:-railway}"
DB_HOST="${DB_HOST:-centerbeam.proxy.rlwy.net}"
DB_PORT="${DB_PORT:-43916}"
DB_USER="${DB_USERNAME:-root}"
DB_PASS="${DB_PASSWORD}"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "🔄 Starting database backup..."
echo "📅 Timestamp: $TIMESTAMP"
echo "🗄️  Database: $DB_NAME"
echo "🌐 Host: $DB_HOST"

# Create backup
echo "📦 Creating backup..."
mysqldump -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" \
  --single-transaction \
  --routines \
  --triggers \
  --events \
  --add-drop-database \
  --databases "$DB_NAME" | gzip > "$BACKUP_DIR/backup_$TIMESTAMP.sql.gz"

if [ $? -eq 0 ]; then
  echo "✅ Backup created: backup_$TIMESTAMP.sql.gz"
else
  echo "❌ Backup failed!"
  exit 1
fi

# Verify backup integrity
echo "🔍 Verifying backup integrity..."
gunzip -t "$BACKUP_DIR/backup_$TIMESTAMP.sql.gz"

if [ $? -eq 0 ]; then
  echo "✅ Backup verification successful"
else
  echo "❌ Backup verification failed!"
  exit 1
fi

# Get backup size
BACKUP_SIZE=$(du -h "$BACKUP_DIR/backup_$TIMESTAMP.sql.gz" | cut -f1)
echo "📊 Backup size: $BACKUP_SIZE"

# Upload to cloud storage (AWS S3)
if command -v aws &> /dev/null; then
  echo "☁️  Uploading to S3..."
  aws s3 cp "$BACKUP_DIR/backup_$TIMESTAMP.sql.gz" \
    "s3://mydewbox-backups/daily/backup_$TIMESTAMP.sql.gz" \
    --storage-class STANDARD_IA
  
  if [ $? -eq 0 ]; then
    echo "✅ Uploaded to S3"
  else
    echo "⚠️  S3 upload failed (backup still saved locally)"
  fi
fi

# Keep only last 30 days locally
echo "🧹 Cleaning old backups..."
find "$BACKUP_DIR" -name "backup_*.sql.gz" -mtime +30 -delete
echo "✅ Old backups cleaned"

# Log backup completion
echo "✅ Backup completed successfully at $(date)"
echo "📁 Location: $BACKUP_DIR/backup_$TIMESTAMP.sql.gz"

# Send notification (optional)
if [ -n "$SLACK_WEBHOOK_URL" ]; then
  curl -X POST "$SLACK_WEBHOOK_URL" \
    -H 'Content-Type: application/json' \
    -d "{\"text\":\"✅ Database backup completed: $TIMESTAMP ($BACKUP_SIZE)\"}"
fi

exit 0
