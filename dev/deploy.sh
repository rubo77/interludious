#!/bin/bash
# Deploy script for Thrust web app
# Builds the app and uploads it to the server via SSH

set -e  # Exit on error

# Configuration
REMOTE_USER="root"
REMOTE_HOST="vm06.eclabs"
REMOTE_PATH="/var/kunden/webs/ruben/www/interludious.z11.de/"

echo "Building Thrust web app..."
npm run build

echo "Uploading to ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}..."
rsync -avz --delete dist/ ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}

echo "Deploy complete!"
