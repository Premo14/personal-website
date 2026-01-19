variable "aws_region" {
  description = "AWS Region"
  default     = "us-east-1"
}

variable "aws_profile" {
    description = "AWS CLI Profile"
    default = "default"
}



variable "key_name" {
  description = "Name of the SSH key pair in AWS"
}

variable "domain_name" {
    description = "Domain name (e.g., anthonypremo.com)"
    default = "anthonypremo.com"
}

variable "vite_upload_passcode" {
  description = "Passcode for admin actions (resume upload)"
  sensitive   = true
}