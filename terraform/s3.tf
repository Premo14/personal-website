# S3 Storage Configuration

# 1. Public Uploads Bucket
# Stores user-uploaded content (images, PDFs) serveable via public URL.
resource "aws_s3_bucket" "uploads_bucket" {
  bucket = "premsanity-uploads-${var.aws_region}"
  
  tags = {
    Name        = "Premsanity Uploads"
    Environment = "Production"
  }
}

# Configure public access block settings
# We explicitly allow public policies/ACLs for this specific bucket.
resource "aws_s3_bucket_public_access_block" "uploads_public" {
  bucket = aws_s3_bucket.uploads_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# Bucket Policy: Allow public read access to all objects
resource "aws_s3_bucket_policy" "uploads_policy" {
  bucket = aws_s3_bucket.uploads_bucket.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.uploads_bucket.arn}/*"
      },
    ]
  })

  # Ensure block settings are cleared before applying policy
  depends_on = [aws_s3_bucket_public_access_block.uploads_public]
}

# 2. Private Backups Bucket
# Stores automated database backups. Not publicly accessible.
resource "aws_s3_bucket" "backups_bucket" {
  bucket = "premsanity-backups-${var.aws_region}"

  tags = {
    Name        = "Premsanity Backups"
    Environment = "Production"
  }
}

# Enable versioning for recovery safety
resource "aws_s3_bucket_versioning" "backups_versioning" {
  bucket = aws_s3_bucket.backups_bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}
