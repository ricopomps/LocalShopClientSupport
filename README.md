# 🛒 LocalShop - Sistema Distribuído de E-commerce

Projeto desenvolvido para a disciplina **Projeto e Implementação de Sistemas Distribuídos** com foco na aplicação de boas práticas de **segurança** em arquiteturas baseadas em **microsserviços**.

## 📌 Descrição

O **LocalShop** é uma aplicação distribuída de e-commerce que permite que os usuários simulem uma experiência de compra indoor, onde os produtos são organizados em um grid bidimensional. O sistema fornece a rota mais curta para o cliente localizar os produtos desejados na loja física.

Nesta versão do projeto, o foco foi a implementação de **medidas de segurança** em um ambiente distribuído. Entre os destaques, estão:

- Criptografia do corpo das requisições HTTP, garantindo **confidencialidade dos dados em trânsito**.
- Validação de acesso por URL, **restringindo zonas seguras** para usuários autenticados.
- Integração de um **API Gateway**, centralizando o roteamento e a autenticação entre os serviços.

## 🧱 Arquitetura

A aplicação é composta por diversos microsserviços interligados por meio de um **API Gateway**, sendo responsáveis por funcionalidades específicas do sistema. O uso de arquitetura distribuída garante:

- Escalabilidade
- Manutenção facilitada
- Segurança segmentada por serviço

## 🛡️ Medidas de Segurança Implementadas

- **Criptografia do corpo da requisição HTTP** (ex: AES)
- **Criptografia de dados sensíveis no banco** (ex: senhas com Bcrypt)
- **Validação de acesso via middleware de autenticação**
- **Controle de acesso a URLs**
- **Remoção ou ofuscação de identificadores em rotas públicas (UUIDs ou hashes)**

## ⚙️ Como Rodar o Projeto

Siga os passos abaixo para configurar e rodar o sistema localmente:

1. Configure os arquivos `.env` para cada uma das APIs.
2. Na raiz do projeto, instale as dependências:
   ```bash
   npm i
3. Ainda na raiz do projeto, atualize os projetos com o comando:
   ```bash
   npm run update
4. E para finalizar, executar o comando para rodar o projeto:
   ```bash
   npm run dev
