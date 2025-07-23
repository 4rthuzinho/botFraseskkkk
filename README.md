# 🤖 botFrases - WhatsApp Motivacional

Bot que envia frases motivacionais automáticas para o WhatsApp usando a biblioteca WWBJS e a API ZenQuotes.

---

# 📝 Resumo do que tá em produção agora:

PROVIDER=gpt|zenquotes

CHANNEL=whatsapp|discord

.env configura tudo

Código único e modular

Envio automático e seguro, com pm2 limpo

## 🔌 Tecnologias utilizadas

- [Node.js]
- [whatsapp-web.js]
- [ZenQuotesAPI]
- [Google_TranslateAPI(não_oficial)]
- [API_Open_AI]

---

## 📍 Roadmap (futuro)

- [x] Envio de frase motivacional via WhatsApp
- [x] Reconexão automática
- [x] Envio para o tel da tereza
- [x] TUDO FUNCIONANDO
- [x] Tradução dinâmica
- [x] Separação de providers (gerador de frase)
- [x] Separação de providers (api de whatsapp)
- [x] Criação de provider gerador de frase > GPT
- [x] Integração com Discord
- [ ] Envio simultaneo em 2 canais > Discord e Zap
- [ ] Suporte a versículos bíblicos (Bible API)
- [ ] Envio automático para grupos
- [ ] Integração com Instagram (DM)
- [ ] Painel web para controle das frases
- [ ] Sistema de assinatura mensal (SaaS motivacional)

---

## 👤 Autor

Feito com ☕ por Arthur Diogo >> [https://github.com/4rthuzinho]


## ⚙️ Como Rodar

pm2 restart bot-frases
...