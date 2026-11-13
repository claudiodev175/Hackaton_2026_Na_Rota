# 🏆 Equipe 11 - Hackathon APONTI Academy 2026

> **Desafio:** Antena na Lama (REC'n'Play 2026)
> **Caminho escolhido:** Alertar e proteger

## 📖 Sobre o Projeto

O **Na Rota** é uma aplicação mobile-first para orientar pessoas em situações de emergência na Região Metropolitana do Recife. A solução reúne identificação rápida da localização, acionamento de canais oficiais de resgate, consulta de abrigos e informações meteorológicas em uma interface simples, acessível e preparada para uso sob estresse.

O fluxo não exige login, CPF ou cadastro demorado. A pessoa informa o bairro ou município, a quantidade de pessoas e a existência de grupos prioritários. Em seguida, pode acessar o S.O.S., consultar abrigos próximos, ligar para a Defesa Civil ou para o Corpo de Bombeiros e compartilhar um resumo da emergência.

O aplicativo prioriza resiliência offline: a base de localidades, abrigos e contatos essenciais funciona localmente. A previsão meteorológica é consultada pelo Open-Meteo quando há conexão, sem impedir o uso das funções principais quando a internet estiver indisponível.

## 👥 Equipe

*   **Desenvolvedores:**
    *   Thiago Yuji Gelinski Ichikawa - Teste de Software
    *   Raíla de Araújo Silva - Análise de Dados
    *   Edson Vinicius Souza Dos Santos - DevOps
    *   Cláudio Vinícius Coelho Barros - Análise de Dados
*   **Validador(a) (Movimento Pró-Criança):**
    *   Jamille Vitória Andrade do Nascimento

> Os nomes da equipe e do(a) validador(a) devem ser preenchidos pela equipe organizadora do projeto.

## 🚀 Tecnologias Utilizadas

*   **Front-end:** Angular 19, TypeScript, RxJS, Signals e CSS com tokens de design próprios.
*   **Back-end:** Java 17 e Spring Boot 4.1.2 com Spring Web MVC.
*   **Banco de Dados:** Não utilizado. Dados essenciais de localidades, abrigos e contatos ficam no frontend para garantir funcionamento offline.
*   **Integração externa:** Open-Meteo para previsão meteorológica e geocodificação.
*   **Deploy:** https://na-rota.onrender.com/
*   **Testes:** Jasmine/Karma no frontend e JUnit/Spring Boot Test no backend.
*   **CI:** GitHub Actions com build, testes unitários Angular e testes Maven.

## 🤖 Uso Ético de IA (Obrigatório pelo Edital)

*Conforme o item 9 do edital, a equipe deve registrar onde a IA foi usada e como o resultado foi revisado.*

*   **Onde a IA foi usada:** apoio na criação e refinamento de componentes Angular, tokens visuais, acessibilidade, testes unitários, documentação e configuração do CI.
*   **O que foi corrigido/validado:** o código foi revisado pela equipe, com validação do build Angular, testes unitários, fluxo de navegação entre Identificação, S.O.S. e Abrigos, contraste, foco por teclado, alvos de toque e funcionamento offline. Também foram corrigidos providers HTTP ausentes nos testes e expectativas obsoletas do template inicial.
*   **Ferramentas usadas:** GitHub Copilot.

## 🛠️ Como rodar o projeto localmente

### Pré-requisitos

*   Node.js 20 ou superior.
*   npm.
*   Java 17 ou superior.
*   Google Chrome ou Chromium para executar os testes Angular em modo headless.

### Front-end

```bash
cd web
npm install
npm start
```

O frontend ficará disponível em `http://localhost:4200`.

Para gerar o build de produção:

```bash
cd web
npm run build
```

### Back-end

Em Linux/macOS:

```bash
cd api
./mvnw spring-boot:run
```

No Windows:

```powershell
cd api
.\mvnw.cmd spring-boot:run
```

O backend será iniciado na porta `8080`. O endpoint de saúde é `GET /health`.

## 🌐 Deploy Público

*   **Link do Front-end:** na-rota.onrender.com

## 🧪 Testes Automatizados

O projeto executa testes automatizados no GitHub Actions por meio de `.github/workflows/ci.yml`.

### Frontend

```bash
cd web
npm test -- --watch=false --browsers=ChromeHeadless --no-progress
```

Os testes cobrem a jornada de identificação, navegação para o S.O.S., acesso aos abrigos, retorno para alteração dos dados, limites de pessoas, acionamento dos canais de emergência e geração de rotas.

### Backend

Em Linux/macOS:

```bash
cd api
./mvnw test
```

No Windows:

```powershell
cd api
.\mvnw.cmd test
```

O CI também executa `npm run build` no frontend antes dos testes unitários.
