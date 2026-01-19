# AWS Lightsail Instance Resource
# Provisions a low-cost virtual private server (VPS) for the application.
resource "aws_lightsail_instance" "server" {
  name              = "premsanity-server"
  availability_zone = "${var.aws_region}a"
  blueprint_id      = "amazon_linux_2023"
  bundle_id         = "nano_3_0" # 512MB RAM, 1 vCPU, 20GB SSD ($3.50/mo)
  key_pair_name     = var.key_name

  # Bootstrapping script
  # Injects environment variables and performs initial configuration
  user_data = templatefile("userdata.sh", {
    VITE_UPLOAD_PASSCODE = var.vite_upload_passcode
    DOMAIN_NAME          = var.domain_name
  })

  tags = {
    Name = "Premsanity Server"
    Environment = "Production"
  }
}

# Static IP Address
# Ensures the server IP remains constant across reboots or instance replacements.
resource "aws_lightsail_static_ip" "server_ip" {
  name = "premsanity-static-ip"
}

# Attach Static IP to the Instance
resource "aws_lightsail_static_ip_attachment" "server_ip_attach" {
  static_ip_name = aws_lightsail_static_ip.server_ip.name
  instance_name  = aws_lightsail_instance.server.name
}

# Firewall Configuration (Public Ports)
resource "aws_lightsail_instance_public_ports" "server_firewall" {
  instance_name = aws_lightsail_instance.server.name

  # SSH Access
  port_info {
    protocol  = "tcp"
    from_port = 22
    to_port   = 22
  }

  # HTTP (Web)
  port_info {
    protocol  = "tcp"
    from_port = 80
    to_port   = 80
  }

  # HTTPS (Secure Web)
  port_info {
    protocol  = "tcp"
    from_port = 443
    to_port   = 443
  }
}
