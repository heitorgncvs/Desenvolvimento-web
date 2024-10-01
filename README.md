# Desenvolvimento-web3
Primeiro repositorio dia 28/08/2024.

Nome: Heitor Augusto Gonçalves



No lab16 aprendemos a fazer uma calculadora e a estiliza-la da forma correta e mais atraente

 Servidor Web Básico com Node.js

Este projeto implementa um servidor web básico utilizando Node.js, atendendo aos requisitos do laboratório. O servidor responde a requisições HTTP e possui as seguintes rotas:

 Rotas implementadas

- **Página Inicial** (`GET /`): Exibe a página inicial.
- **Página Sobre** (`GET /about`): Exibe informações sobre o projeto.
- **Rota de Upload** (`POST /upload`): Permite o upload de arquivos.
- **Página 404**: Retorna uma mensagem para rotas não encontradas.

 Comandos cURL para testar as funcionalidades

1. Testar a página inicial:
   ```bash
   curl http://127.0.0.1:3000/
