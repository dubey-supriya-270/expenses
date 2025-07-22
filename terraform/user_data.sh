#!/bin/bash
# user_data.sh - Clean version that uses your existing files

set -e
exec > >(tee /var/log/user-data.log) 2>&1

echo "Starting user data script..."

# Update system and install Docker
yum update -y
yum install -y docker git
systemctl start docker
systemctl enable docker
usermod -aG docker ec2-user

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Create application directory
mkdir -p /opt/app
cd /opt/app

# Create environment file with your secrets
cat > .env << EOF
POSTGRES_USER=appuser
POSTGRES_PASSWORD=${postgres_password}
POSTGRES_DB=appdb
REDIS_PASSWORD=${redis_password}
JWT_PRIVATE_KEY=${jwt_private_key}
EOF

# Set permissions
chown -R ec2-user:ec2-user /opt/app

# Create a simple startup script
cat > /opt/app/start.sh << 'EOF'
#!/bin/bash
cd /opt/app
docker-compose up -d
EOF

chmod +x /opt/app/start.sh

# Create systemd service to auto-start
cat > /etc/systemd/system/observability-stack.service << 'EOF'
[Unit]
Description=Observability Stack
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
ExecStart=/opt/app/start.sh
ExecStop=/usr/local/bin/docker-compose -f /opt/app/docker-compose.yml down
WorkingDirectory=/opt/app
User=ec2-user
Group=ec2-user

[Install]
WantedBy=multi-user.target
EOF

systemctl enable observability-stack.service

echo "User data script completed. Ready for your application files!"