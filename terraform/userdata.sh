#!/bin/bash
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1
set -euxo pipefail

# 1. Install Dependencies
dnf update -y
dnf install -y nginx git certbot python3-certbot-nginx

# 2. Prevent Nginx from starting immediately (we need to config it)
systemctl stop nginx

# 3. Create Application Directory
mkdir -p /var/www/personal-website/dist
mkdir -p /var/www/personal-website/uploads
chown -R ec2-user:ec2-user /var/www/personal-website

# 3.5 Create .env file
cat <<EOF > /var/www/personal-website/.env
APP_ENV=production
VITE_BUILD_STAGE=production
VITE_PORT=80
VITE_BACKEND_PORT=8080
VITE_RESUME_UPLOAD_PASSCODE=${VITE_UPLOAD_PASSCODE}
ADMIN_PASSPHRASE=${VITE_UPLOAD_PASSCODE}
DB_DRIVER=sqlite
DB_NAME=personal_website.db
EOF

# 4. Create Systemd Service for Go Backend
cat <<EOF > /etc/systemd/system/personal-website.service
[Unit]
Description=Personal Website Backend
After=network.target

[Service]
User=ec2-user
Group=ec2-user
WorkingDirectory=/var/www/personal-website
EnvironmentFile=/var/www/personal-website/.env
ExecStart=/var/www/personal-website/server
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# 5. Configure Nginx
cat <<EOF > /etc/nginx/conf.d/personal-website.conf
server {
    listen 80;
    server_name ${DOMAIN_NAME} www.${DOMAIN_NAME};

    location / {
        root /var/www/personal-website/dist;
        try_files \$uri \$uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
    
    location /uploads {
        alias /var/www/personal-website/uploads;
    }
}
EOF

# Remove default nginx config if it conflicts
rm -f /etc/nginx/conf.d/default.conf

# 6. Start Services
systemctl daemon-reload
systemctl enable personal-website
systemctl enable nginx
systemctl start nginx

# 7. Provision SSL Certificate (optional, will fail if DNS not propagated)
# We use a subshell and || true to ensure userdata completes even if certbot fails
(
    certbot --nginx -d ${DOMAIN_NAME} -d www.${DOMAIN_NAME} --non-interactive --agree-tos --register-unsafely-without-email || echo "Certbot failed, likely due to DNS propagation."
)

echo "UserData script completed."
