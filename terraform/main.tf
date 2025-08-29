provider "aws" {
  profile = "prod-739"
  region = var.aws_region
}

# Security group for EC2 instances
resource "aws_security_group" "allow_http_https_ssh" {
  description = "Allow traffic from ALB and SSH traffic from specific IP"
  vpc_id      = aws_vpc.personal_site_vpc.id

  ingress {
    description = "Allow SSH traffic"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["67.255.0.111/32"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "PersonalSite-EC2-SecurityGroup" }
}

# Inbound rule for HTTP from ALB to EC2 instance
resource "aws_security_group_rule" "allow_http_from_alb" {
  type                     = "ingress"
  from_port                = 80
  to_port                  = 80
  protocol                 = "tcp"
  security_group_id        = aws_security_group.allow_http_https_ssh.id
  source_security_group_id = aws_security_group.alb_security_group.id
  description              = "Allow HTTP traffic from ALB"
}

resource "aws_security_group_rule" "allow_backend_from_alb" {
  type                     = "ingress"
  from_port                = 8080
  to_port                  = 8080
  protocol                 = "tcp"
  security_group_id        = aws_security_group.allow_http_https_ssh.id
  source_security_group_id = aws_security_group.alb_security_group.id
  description              = "Allow backend traffic from ALB on port 8080"
}

# IAM instance profile
resource "aws_iam_instance_profile" "PersonalSiteInstanceProfile" {
  name = "PersonalSiteInstanceProfile"
  role = "EC2AdminRole"
}

# VPC and Subnet configurations
resource "aws_vpc" "personal_site_vpc" {
  cidr_block = "10.0.0.0/16"
  tags = { Name = "PersonalSiteVPC" }
}

resource "aws_subnet" "personal_site_subnet_1" {
  vpc_id            = aws_vpc.personal_site_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1a"
  tags = { Name = "PersonalSiteSubnet1" }
}

resource "aws_subnet" "personal_site_subnet_2" {
  vpc_id            = aws_vpc.personal_site_vpc.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "us-east-1b"
  tags = { Name = "PersonalSiteSubnet2" }
}

# Internet Gateway
resource "aws_internet_gateway" "personal_site_igw" {
  vpc_id = aws_vpc.personal_site_vpc.id
  tags = { Name = "PersonalSiteInternetGateway" }
}

# Route Table
resource "aws_route_table" "personal_site_public_rt" {
  vpc_id = aws_vpc.personal_site_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.personal_site_igw.id
  }

  tags = { Name = "PersonalSitePublicRouteTable" }
}

resource "aws_route_table_association" "personal_site_rta_1" {
  subnet_id      = aws_subnet.personal_site_subnet_1.id
  route_table_id = aws_route_table.personal_site_public_rt.id
}

resource "aws_route_table_association" "personal_site_rta_2" {
  subnet_id      = aws_subnet.personal_site_subnet_2.id
  route_table_id = aws_route_table.personal_site_public_rt.id
}

# EC2 instance
resource "aws_instance" "PersonalSiteEC2" {
  ami                      = var.ami_id
  instance_type            = var.instance_type
  key_name                 = var.key_name
  iam_instance_profile     = aws_iam_instance_profile.PersonalSiteInstanceProfile.name
  subnet_id                = aws_subnet.personal_site_subnet_1.id
  associate_public_ip_address = true

  root_block_device {
    volume_size = 30
    volume_type = "gp2"
  }

  vpc_security_group_ids = [aws_security_group.allow_http_https_ssh.id]

  user_data = templatefile("userdata.sh", {
    POSTGRES_DB                 = var.postgres_db,
    POSTGRES_USER               = var.postgres_user,
    POSTGRES_PASSWORD           = var.postgres_password,
    POSTGRES_PORT               = var.postgres_port,
    BACKEND_PORT                = var.backend_port,
    VITE_BUILD_STAGE            = var.vite_build_stage,
    VITE_UPLOAD_PASSCODE        = var.vite_upload_passcode
  })

  tags = { Name = "PersonalSiteEC2Instance" }
}

# ALB setup
resource "aws_lb" "personal_site_alb" {
  name               = "personal-site-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_security_group.id]
  subnets            = [aws_subnet.personal_site_subnet_1.id, aws_subnet.personal_site_subnet_2.id]
  tags = { Name = "PersonalSiteALB" }
}

# Security group for ALB
resource "aws_security_group" "alb_security_group" {
  vpc_id      = aws_vpc.personal_site_vpc.id
  description = "Allow HTTP and HTTPS traffic from the internet to the ALB"

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ALB HTTPS listener with HTTP-to-HTTPS redirect
resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.personal_site_alb.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = var.certificate_arn

  default_action {
    type = "fixed-response"
    fixed_response {
      content_type = "text/plain"
      message_body = "Not Found"
      status_code  = "404"
    }
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.personal_site_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "redirect"
    redirect {
      protocol = "HTTPS"
      port     = "443"
      status_code = "HTTP_301"
    }
  }
}

# Listener rules to forward to frontend/backend TGs based on hostname
resource "aws_lb_listener_rule" "frontend_rule" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 10

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.personal_site_frontend_tg.arn
  }

  condition {
    host_header {
      values = ["premsanity.com"]
    }
  }
}

resource "aws_lb_listener_rule" "backend_rule" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 20

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.personal_site_backend_tg.arn
  }

  condition {
    host_header {
      values = ["premsanity.com"]
    }
  }

  condition {
    path_pattern {
      values = ["/api/*"]
    }
  }
}

# Target groups for frontend and backend
resource "aws_lb_target_group" "personal_site_frontend_tg" {
  name        = "personal-site-frontend-tg"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = aws_vpc.personal_site_vpc.id
  target_type = "instance"

  health_check {
    interval            = 30
    path                = "/"
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
    matcher             = "200"
  }
}

resource "aws_lb_target_group" "personal_site_backend_tg" {
  name        = "personal-site-backend-tg"
  port        = var.backend_port
  protocol    = "HTTP"
  vpc_id      = aws_vpc.personal_site_vpc.id
  target_type = "instance"

  health_check {
    interval            = 30
    path                = "/api/v1/health"
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
    matcher             = "200"
  }
}

# DNS records
data "aws_route53_zone" "premsanity" {
  zone_id = "Z0615570119VZWM7X1M4V"
}

resource "aws_route53_record" "premsanity_com" {
  zone_id = data.aws_route53_zone.premsanity.zone_id
  name    = "premsanity.com"
  type    = "A"

  alias {
    name                   = aws_lb.personal_site_alb.dns_name
    zone_id                = aws_lb.personal_site_alb.zone_id
    evaluate_target_health = true
  }
}

# Attach EC2 to target groups
resource "aws_lb_target_group_attachment" "frontend_attachment" {
  target_group_arn = aws_lb_target_group.personal_site_frontend_tg.arn
  target_id        = aws_instance.PersonalSiteEC2.id
  port             = 80
}

resource "aws_lb_target_group_attachment" "backend_attachment" {
  target_group_arn = aws_lb_target_group.personal_site_backend_tg.arn
  target_id        = aws_instance.PersonalSiteEC2.id
  port             = var.backend_port
}
