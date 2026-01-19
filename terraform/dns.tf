# DNS Configuration (Route 53)

# Fetch the hosted zone ID for the domain
data "aws_route53_zone" "primary" {
  name = var.domain_name
}

# 'www' Subdomain Record
resource "aws_route53_record" "www" {
  zone_id = data.aws_route53_zone.primary.zone_id
  name    = "www.${var.domain_name}"
  type    = "A"
  ttl     = "300"
  records = [aws_lightsail_static_ip.server_ip.ip_address]
}

# Root Domain Record (@)
resource "aws_route53_record" "root" {
  zone_id = data.aws_route53_zone.primary.zone_id
  name    = var.domain_name
  type    = "A"
  ttl     = "300"
  records = [aws_lightsail_static_ip.server_ip.ip_address]
}
