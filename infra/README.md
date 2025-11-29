# Terraform infrastructure (AWS)

Este diretório contém a definição de infraestrutura para publicar o Strapi em um serviço ECS Fargate por trás de um Application Load Balancer.

## Pré-requisitos

- Terraform >= 1.5
- Conta AWS com permissões para criar ECS, IAM, ALB e networking
- Bucket S3 + tabela DynamoDB para guardar o estado remoto (`terraform init -backend-config ...`)

## Variáveis principais

| Variável | Descrição |
| --- | --- |
| `region` | Região AWS (default `us-east-1`) |
| `environment` | Identificador do ambiente (`dev`, `prod`, etc.) |
| `image_name` | Imagem Docker publicada no Docker Hub (ex.: `renatoribas/devops-unisatc-a3:latest`) |
| `app_keys`, `admin_jwt_secret`, `api_token_salt`, `transfer_token_salt` | Segredos necessários para o Strapi |

## Exemplo de uso

```bash
cd infra
terraform init \
  -backend-config="resource_group_name=rg-tfstate" \
  -backend-config="storage_account_name=stterraformstate" \
  -backend-config="container_name=tfstate" \
  -backend-config="key=devops-unisatc-a3.tfstate"
terraform plan -var="image_name=renatoribas/devops-unisatc-a3:latest" \
  -var="app_keys=..." \
  -var="admin_jwt_secret=..." \
  -var="api_token_salt=..." \
  -var="transfer_token_salt=..."
terraform apply
```

Os valores sensíveis devem ser passados via variáveis de ambiente ou arquivos `.tfvars` não versionados. O backend do Terraform (bucket S3 + tabela DynamoDB) deve ser configurado via `backend-config`, conforme exemplo acima. O output `app_url` contém o endereço público exposto pelo Application Load Balancer.

