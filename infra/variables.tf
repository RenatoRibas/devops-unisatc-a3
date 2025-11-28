variable "region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Short environment identifier (e.g. dev, prod)"
  type        = string
  default     = "dev"
}

variable "image_name" {
  description = "Docker image (e.g. renatoribas/devops-unisatc-a3:latest)"
  type        = string
}

variable "app_keys" {
  description = "Strapi APP_KEYS"
  type        = string
}

variable "admin_jwt_secret" {
  description = "Strapi ADMIN_JWT_SECRET"
  type        = string
}

variable "api_token_salt" {
  description = "Strapi API_TOKEN_SALT"
  type        = string
}

variable "transfer_token_salt" {
  description = "Strapi TRANSFER_TOKEN_SALT"
  type        = string
}


