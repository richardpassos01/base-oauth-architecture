# BASE ARCHITECTURE - MULTI DATABASE

Olá pessoal,

Estou criando este code base para facilitar na construção de aplicações nodejs, utilizando express, mongoose, sequelize e redis.

Estruturei em minha visão essa arquitetura que pode atender grandes e pequenos projetos, utilizando conceitos de factory e camada de dominio, dei inicio ao projeto.

## COMO UTILIZAR
* clone o projeto
* rode o comando `npm install`
* crie um arquivo .env se baseando no env-example, informando se está ou não utilizando os bancos de dados.
* Rode o comando `npm start` ou, caso esteja utilizando vscode, deixei commitado as configurações do launch.json na pasta .vscode.

## TODO
* Melhorar/ automatizar documentação com swagger-ui-express
* Criar mock/stub para new Dates e utiliza-los nos testes unitários.
* Criar coverage 100% nos arquivos
* Corrigir e melhorar migrations do mongo-db, talves utilizar a lib `migrate-mongo`
* Dockerizar projeto e criar docker-compose

# CONTRIBUIÇÕES SÃO SEMPRE BEM VINDAS :D
