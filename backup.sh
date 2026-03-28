#!/bin/bash
cd /home/skarbolt/Documents/C0PYC4T10
zip -r SPORTS247-backup.zip SPORTS247 -x "node_modules/*" -x "server_output.log" -x "server.log"
echo "Backup created: SPORTS247-backup.zip"