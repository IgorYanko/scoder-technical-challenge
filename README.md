# ⚡ Clean Energy Lead Simulator

> Desafio Técnico - Desenvolvedor Fullstack Júnior | Scoder Tech Studio

## 🧩 Sobre o Projeto

Esta aplicação fullstack foi desenvolvida para a empresa **Clean Energy**, com o objetivo de simular a economia gerada ao migrar para energia renovável e capturar **leads** para posterior contato comercial.

A aplicação possui uma interface pública de simulação e uma área administrativa protegida para gerenciamento dos leads capturados.

---

## 🌐 Deploy

Você pode acessar a aplicação hospedada na **Vercel** através do link abaixo:

Para acessar a parte de admnistrador use as seguintes credenciais:

Email: scoder@cleanenergy.com
Senha: 123456

🔗 **[https://scoder-technical-challenge-6jflcdh3h-igor-yankos-projects.vercel.app](https://scoder-technical-challenge-6jflcdh3h-igor-yankos-projects.vercel.app)**

---

## 🎯 Funcionalidades

### 👥 Público Geral
- Formulário para simulação de economia:
  - Valor da conta de energia (R$)
  - Cidade e estado
  - Tipo de fornecimento (Monofásico, Bifásico ou Trifásico)
- Formulário para visualização da simulação:
  - Nome, e-mail, telefone e CPF
- Cálculo automático da economia com 25% de desconto:
  - Exibição do valor economizado em **1, 3 e 5 anos**

### 🔐 Administrador
- Tela de login com e-mail e senha
- Listagem de leads capturados com:
  - Nome, cidade, estado e valor da fatura
- Ação para **excluir leads**

---

## 🛠️ Tecnologias Utilizadas

| Categoria       | Ferramentas / Tecnologias                        |
|-----------------|--------------------------------------------------|
| **Frontend**    | Next.js + TypeScript + Tailwind CSS             |
| **Backend**     | Next.js API Routes                               |
| **Validação**   | React Hook Form + Zod                            |
| **Banco de Dados** | PostgreSQL (via Docker)                       |
| **Deploy**      | Vercel + Railway                                 |
| **Auxiliares**  | DBeaver (visualização do banco)                 |
|                 | Postman (criação de admin, testes de API)       |
|                 | Gemini Pro (boas práticas e resolução de erros) |
