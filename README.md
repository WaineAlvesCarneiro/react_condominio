Condomínio

Bem-vindo ao repositório do projeto react_condominio. Esse é o front-end do sistema de gerenciamento de condomínios.

É um sistema projetado para Cloud permitindo que sejam cadastradas diversos condomínios como empresas, e diversos usuários.

Observação: O back-end tem duas camadas de apresentação: Uma camada de apresentação com endpoints Controller e outra com Minimal API

Esse sistema permite que ao executar localmente possa ser utilizada qualquer uma das duas camadas de apresentação com Controller ou Minimal API


Descrição do Projeto:

Este projeto é a camada de serviços (API) que gerencia todas as informações do sistema de condomínio, incluindo:
Ao ser executado pela primeira vez o sistema cadastra automaticamente um usuário Admin com senha

Ao logar o Admin poderá:

Cadastro de empresa que será o condomínio, em seguida cadastra os usuários que serão utilizados no sistema.

Existe três perfis padrão de usuário que são:
Suporte - Admin
Síndico - administrador do condomínio
Porteiro - responsável pelos trabalhos diários da portaria

Quando logado com um usuário vinculado a uma empresa/condomínio o sistema somente irá mostrar os dados relacionados ao usuário logado de acordo com a empresa.

O usuário com perfil Síndico poderá cadastrar os imóveis e também inativar usuários. Somente o usuário com perfil suporte pode cadastrar ou excluir usuários.

Após cadastrar o imovel o usuário com perfil síndico pode cadastrar moradores e vincular ao seu imovel.


Autenticação e Autorização:

Sistema de segurança utilizando JWT com Role para garantir que apenas usuários autorizados possam acessar a aplicação.


Tecnologias Utilizadas

Frontend:

React

JavaScript

CSS

Backend:

Comunica com API disponível no GitHub:

RESTful API em C# - ASP Net Core versão 8 - https://github.com/WaineAlvesCarneiro/AspNetCore_Condominio

Banco de Dados:

SQL Server

Pré-requisitos

Antes de começar, certifique-se de que você tem as seguintes ferramentas instaladas:

Node.js (versão 14 ou superior recomendada)

npm (geralmente incluído com o Node.js)

Ao instalar o SQL Server defina o banco de dados localmente.

Em seguida execute os scripts disponíveis no projeto condomínio de Backend

https://github.com/WaineAlvesCarneiro/SQL_Server_Scrips_Condominio_API

Instalação e Execução

Siga os passos abaixo para configurar e executar o projeto localmente:

Clone o repositório:

https://github.com/WaineAlvesCarneiro/react_condominio

cd react_condominio

Instale as dependências:

npm install react-router-dom axios

npm install react-datepicker

npm install jwt-decode

npm install react-toastify

npm install react-imask

Configure o ambiente:

Execute a aplicação:

npm start

A aplicação estará disponível em http://localhost:4200/.

Para testar use:

Usuário: Admin

Senha: 12345

Desenvolvido por Waine Alves Carneiro