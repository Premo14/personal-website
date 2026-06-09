#!/bin/bash
set -e

# --- Deployment Configuration ---
LIGHTSAIL_HOST="anthonypremo.com"
LIGHTSAIL_USER="ec2-user"
# Dynamically resolve key path relative to script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
KEY_PATH=$(realpath "$SCRIPT_DIR/../terraform/kp/personal-website-key.pem")

# Ensure SSH key exists before proceeding
if [ ! -f "$KEY_PATH" ]; then
    echo "Error: Private key not found at $KEY_PATH"
    exit 1
fi

echo "--- Starting Deployment to $LIGHTSAIL_HOST ---"

# 1. Build React Frontend
echo "Building React Frontend..."
cd ../react
npm run build
cd ..

# 2. Build Go Backend (Target: Linux AMD64)
echo "Building Go Backend..."
cd backend
GOOS=linux GOARCH=amd64 go build -o server
cd ..

# 3. Deploy Artifacts
echo "Deploying artifacts..."

# Sync frontend build directory (delete extraneous files on remote)
rsync -avz --delete \
    -e "ssh -o StrictHostKeyChecking=no -i $KEY_PATH" \
    react/dist/ \
    $LIGHTSAIL_USER@$LIGHTSAIL_HOST:/var/www/personal-website/dist/

# Upload backend binary to a temporary location to avoid 'text file busy' errors
scp -o StrictHostKeyChecking=no -i $KEY_PATH \
    backend/server \
    $LIGHTSAIL_USER@$LIGHTSAIL_HOST:/var/www/personal-website/server.new

# Upload resume PDF if it exists
if [ -f backend/uploads/resume_apremo.pdf ]; then
    scp -o StrictHostKeyChecking=no -i $KEY_PATH \
        backend/uploads/resume_apremo.pdf \
        $LIGHTSAIL_USER@$LIGHTSAIL_HOST:/var/www/personal-website/uploads/resume_apremo.pdf
fi

# 4. Swap Binary & Restart Service
echo "Restarting service..."
ssh -o StrictHostKeyChecking=no -i $KEY_PATH $LIGHTSAIL_USER@$LIGHTSAIL_HOST << 'EOF'
    # Atomically replace the running binary
    mv /var/www/personal-website/server.new /var/www/personal-website/server
    
    # Restart the systemd service
    sudo systemctl restart personal-website
EOF

echo "--- Deployment Complete ---"
