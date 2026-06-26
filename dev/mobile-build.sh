#!/bin/bash
# Mobile build script for Thrust
# Prepares the web app and syncs with Capacitor for Android Studio

set -e  # Exit on error

echo "Building Thrust web app for mobile..."
npm run build

echo "Syncing with Capacitor (Android)..."
npx cap sync android

echo "Opening Android Studio..."
npx cap open android

echo "Mobile build preparation complete!"
echo "Android Studio should now be open with the project ready to build."
