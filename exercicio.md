MATERIAIS ASSOCIADOS
Projeto N3/A3:
https://github.com/gledsonscotti/devops-unisatc-a3

MATERIAIS ASSOCIADOS

O A3 consiste em criar todo o processo de deploy de uma aplicação. Desde a criação dos testes até a disponibilidade do serviço em algum provedor cloud.
Os pré-requisitos são:
- Utilização do GitHub actions
- Docker para criação das imagens
- Terraform para deploy no provedor de cloud

O software que vocês utilizaram será o Strapi CMS (https://www.strapi.io), porem, já deixei ele configura no repositório https://github.com/gledsonscotti/devops-unisatc-a3, basta cada equipe criar um fork do repositório e enviar as alterações no novo repositório. O Strapi estará configurado para utilizar um banco sqlite que ficara na pasta .tmp/db.

Nele já tem 3 usuários pronto para uso:

Super Admin:
email: admin@satc.edu.br
password: welcomeToStrapi123

Editor
email: editor@satc.edu.br
password: welcomeToStrapi123

Author
email: author@satc.edu.br
password: welcomeToStrapi123

Também temos 3 collections criadas:
- Categoria
- Autor
- Article
Então como entregável até a data 28/11/2025 o projeto precisa apresentar os seguintes itens:

Testes automatizados end-2-end com o Playwright
Pelo menos de 2 das 3 collections existentes
GitHub actions
Uma action deve ser executada na criação de PR
Criar 2 PR
Um deles falhando (force um erro)
Um deles passando
Uma action criando a imagem Docker e colocando a mesma em um repositório de Docker Images (Ex.: Docker Hub, AWS ECR)
Uma action realizando o deploy, rodando terraform e subindo o serviço em um serviços cloud (Ex.: Azure ACI, Aws ECS)
Como entrega final espero a pipeline completa e utilizável.
O trabalho devera ser realizado em grupos de no maximo 3 participantes.