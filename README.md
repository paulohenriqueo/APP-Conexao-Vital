# 🫶 Conexão Vital

**Conexão Vital** é um aplicativo mobile desenvolvido em React Native cujo objetivo é conectar **pacientes e cuidadores** de forma prática, segura e eficiente. Através desta plataforma, pacientes podem buscar profissionais disponíveis, enviar solicitações de contato e, quando aceitas, visualizar informações mais completas e interagir diretamente via WhatsApp.

Este projeto foi desenvolvido como Trabalho de Graduação e aprovado com sucesso em **04/12/2025** 🎓.

---

## 🎯 Visão Geral

O objetivo principal do projeto *Conexão Vital* é facilitar a conexão entre pacientes que buscam cuidados e profissionais de caregiving (cuidadores), proporcionando uma interface intuitiva e um fluxo completo de:

✔ Cadastro e escolha de tipo de perfil  
✔ Pesquisa de perfis por nome, cidade, estado, idiomas e período  
✔ Envio de solicitações de contato  
✔ Aceitação e recusa de solicitações  
✔ Histórico de solicitações  
✔ Avaliação entre usuários após aceitação

Este repositório contém a versão mobile do aplicativo preparada para produção e apresentação acadêmica.

---

## 👩‍💻 Autores

Este projeto foi idealizado e desenvolvido por:

👤 **Paulo Henrique**  
👤 **Sophia**  

---

## 🛠 Tecnologias Utilizadas

O desenvolvimento do *Conexão Vital* utilizou as seguintes tecnologias:

| Tecnologia | Uso |
|------------|-----|
| **React Native** | Estrutura do app mobile |
| **TypeScript** | Tipagem e organização do código |
| **Expo** | Ferramenta para desenvolvimento, build e testes |
| **Firebase Auth** | Autenticação de usuários |
| **Firestore** | Banco de dados em tempo real |
| **React Navigation** | Navegação entre telas |
| **AsyncStorage** | Armazenamento local |
| **Phosphor Icons & Expo Vector Icons** | Ícones e UI visual |
| **Picker** | Seleção de filtros |
| **FlashMessage** | Feedback visual ao usuário |

---

## 🚀 Fluxo de Funcionamento

O fluxo principal do usuário dentro do app é:

1. **Login/Autenticação**  
   Usuário entra com conta já existente ou permanece autenticado com sessão ativa.

2. **Escolha do tipo de conta**  
   O usuário seleciona se é **paciente** ou **cuidador**.

3. **Tela principal (Home)**  
   - Se paciente: pesquisa perfis de cuidadores.
   - Se cuidador: vê métricas de solicitações e histórico.

4. **Pesquisa e Filtros**  
   Pesquisa de perfis com filtro por: nome, cidade, estado, período e idiomas.

5. **Solicitação de contato**  
   O paciente envia uma solicitação para um cuidador.

6. **Aceitar/Recusar Solicitação**  
   O cuidador visualiza solicitações pendentes e pode aceitá-las ou recusá-las.

7. **Histórico de Solicitações**  
   Ambos os perfis podem ver o histórico de interações.

8. **Avaliação**  
   Após solicitação aceita, cada usuário pode avaliar o outro com nota de 1 a 5 estrelas.

---

## ✨ Funcionalidades Principais

### 🧑‍🤝‍🧑 Para Pacientes
- Buscar cuidadores por critérios (nome, localização, idiomas, período)
- Visualizar perfil completo dos cuidadores
- Enviar solicitação de contato
- Avaliar cuidadores após aceitação de solicitação

### 🧑‍⚕️ Para Cuidadores
- Visualizar métricas: pendentes, aceitas, rejeitadas e avaliações
- Aceitar ou recusar solicitações
- Histórico de solicitações
- Avaliar pacientes após aceitação

---


## 💡 Próximos Passos (Possíveis Melhorias)

✔ Login com redes sociais  
✔ Integração com mapas para localização  
✔ Notificações push para novas solicitações  
✔ Dashboard web para administradores  
✔ Suporte a múltiplos idiomas

---

## 📌 Como Rodar o Projeto

1. Clone o repositório:
   
   ```bash
   git clone https://github.com/paulohenriqueo/APP-Conexao-Vital.git
   
2. Instale as dependências:
   
   ```bash
   npm install
   
3. Configure o Firebase (Auth + Firestore) no arquivo FirebaseConfig.ts.
   
4. Inicie no Expo:
   
   ```bash
   npx expo start
