#!/bin/bash

# MongoDB Atlas IP Whitelist Auto-Updater
# This script automatically adds your current IP to MongoDB Atlas whitelist

# Configuration - Replace with your values
ATLAS_PUBLIC_KEY="your_atlas_public_key"
ATLAS_PRIVATE_KEY="your_atlas_private_key" 
PROJECT_ID="your_project_id"

# Get current public IP
CURRENT_IP=$(curl -s https://api.ipify.org)
echo "Current IP: $CURRENT_IP"

# Add IP to Atlas whitelist using Atlas API
curl -X POST \
  "https://cloud.mongodb.com/api/atlas/v1.0/groups/$PROJECT_ID/accessList" \
  --user "$ATLAS_PUBLIC_KEY:$ATLAS_PRIVATE_KEY" \
  --digest \
  --header "Content-Type: application/json" \
  --data "{
    \"ipAddress\": \"$CURRENT_IP\",
    \"comment\": \"Auto-added $(date)\"
  }"

echo "IP $CURRENT_IP added to MongoDB Atlas whitelist"