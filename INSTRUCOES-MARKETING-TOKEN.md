# 📋 Instruções para Gerar Token do Facebook - MARKETING

## Por que precisamos disso?

Para rastrear vendas do Asaas no Facebook e melhorar a otimização das campanhas de anúncios.

---

## ⚡ OPÇÃO 1: Via Events Manager (MAIS FÁCIL)

### Passo a Passo:

1. **Acesse este link**: https://business.facebook.com/events_manager2

2. **Selecione o Pixel**: Clique em `1279949890819385` na lista à esquerda

3. **Vá em Configurações**:
   - Menu lateral esquerdo
   - Ícone de engrenagem ⚙️
   - Ou procure por "Settings"

4. **Encontre "API de Conversões"**:
   - Role a página para baixo
   - Procure pela seção "Conversions API" ou "API de Conversões"
   - **NÃO é a seção de "Parceiros"!**

5. **Gere o Token**:
   - Clique em **"Gerar token de acesso"** ou **"Generate Access Token"**
   - Copie o token (começa com `EAA...`)
   - Envie para o desenvolvedor de forma segura

---

## 🔐 OPÇÃO 2: Via System User (RECOMENDADO - Token permanente)

Se não encontrar na Opção 1, use esta:

### Passo a Passo:

1. **Acesse**: https://business.facebook.com/settings/system-users

2. **Crie um System User**:
   - Clique em **"Adicionar"** (Add)
   - Nome: `API Conversions - Dnotas`
   - Função: **Admin**
   - Clique em **"Criar usuário do sistema"**

3. **Gere o Token**:
   - Depois de criar, clique no usuário
   - Clique em **"Gerar novo token"** (Generate New Token)
   - Selecione o App (ou crie um se não tiver)
   - Marque as permissões:
     - ✅ `ads_management`
     - ✅ `business_management`
   - Clique em **"Gerar Token"**

4. **Atribua o Pixel ao System User**:
   - Na mesma tela, vá em **"Atribuir ativos"** (Assign Assets)
   - Selecione **"Pixels"**
   - Adicione o Pixel `1279949890819385`
   - Permissão: **Gerenciar Pixel**

5. **Copie e Envie**:
   - Copie o token (começa com `EAA...`)
   - Envie ao desenvolvedor

---

## ❌ O QUE NÃO É (evite estas telas):

### NÃO é a tela de "Parceiros":
- Shopify ❌
- WooCommerce ❌
- Segment ❌
- Estas são integrações de e-commerce, não é o que precisamos!

### NÃO é o Pixel ID:
- O Pixel ID já temos: `1279949890819385`
- Precisamos do **Access Token** (um código longo que começa com `EAA...`)

---

## 🎯 O que estamos procurando:

Uma tela que tenha:
- Título: **"API de Conversões"** ou **"Conversions API"**
- Botão: **"Gerar token de acesso"** ou **"Generate Access Token"**
- Descrição: Algo sobre "enviar eventos do servidor" ou "server events"

---

## 📞 Se não encontrar:

1. **Verifique permissões**: Você precisa ser **Admin** do Business Manager
2. **Tente pelo celular**: Às vezes a interface mobile é diferente
3. **Use a busca**: No Business Manager, busque por "Conversions API"
4. **Peça ajuda ao suporte do Facebook**: Chat de suporte no Business Manager

---

## 🔒 Segurança do Token:

- ⚠️ **NÃO compartilhe publicamente** (Slack público, email aberto)
- ✅ Envie por: DM, WhatsApp, ferramentas seguras
- 📝 Este token dá acesso às campanhas, então trate como uma senha

---

## ✅ Checklist Final:

Antes de enviar ao desenvolvedor, certifique-se de que:
- [ ] O token começa com `EAA...`
- [ ] Tem mais de 100 caracteres
- [ ] Foi gerado para o Pixel correto (1279949890819385)
- [ ] Você tem permissão de Admin

---

## 🆘 Precisa de Ajuda?

Se mesmo assim não conseguir:
1. Tire um print da tela do Events Manager
2. Mostre ao desenvolvedor
3. Podemos buscar outra alternativa

---

**Tempo estimado**: 5-10 minutos
**Dificuldade**: Média (precisa ter permissão de Admin)
**Expira**: Token de usuário expira em 60 dias, System User é permanente
