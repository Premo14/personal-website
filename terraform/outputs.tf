output "server_public_ip" {
  description = "The static public IP of the Lightsail instance"
  value       = aws_lightsail_static_ip.server_ip.ip_address
}
