# variables.tf

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "observability"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "postgres_password" {
  description = "PostgreSQL password"
  type        = string
  sensitive   = true
}

variable "redis_password" {
  description = "Redis password"
  type        = string
  sensitive   = true
}

variable "jwt_private_key" {
  description = "JWT private key"
  type        = string
  sensitive   = true
}