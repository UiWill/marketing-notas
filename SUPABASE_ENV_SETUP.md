# 🔧 Configuração de Variáveis de Ambiente no Supabase

## Objetivo
Configurar as credenciais do Google Analytics no Supabase de forma segura para que a Edge Function possa acessar os dados.

---

## 📋 Pré-requisitos

Antes de começar, você precisa ter:
- ✅ Arquivo JSON de credenciais do Google Analytics (da configuração anterior)
- ✅ Property ID do Google Analytics (número de 9 dígitos)
- ✅ Acesso ao dashboard do Supabase

---

## 🔐 Passo 1: Preparar o conteúdo do arquivo JSON

### 1.1 Abrir o arquivo JSON:
- Localize o arquivo JSON baixado (exemplo: `dnotas-analytics-xxxxxxxxx.json`)
- Abra com um editor de texto (Notepad, VS Code, etc.)

### 1.2 Copiar o conteúdo completo:
- Selecione **TODO** o conteúdo do arquivo
- Copie (Ctrl+C)
- O arquivo deve começar com `{` e terminar com `}`

**Exemplo do que você vai copiar:**
```json
{
  "type": "service_account",
  "project_id": "dnotas-analytics-xxxxx",
  "private_key_id": "xxxxxxxxxx",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBA...\n-----END PRIVATE KEY-----\n",
  "client_email": "dnotas-analytics-reader@xxxxx.iam.gserviceaccount.com",
  "client_id": "xxxxxxxxxxxxx",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

---

## 🌐 Passo 2: Configurar no Supabase

### 2.1 Acessar o dashboard do Supabase:
```
https://supabase.com/dashboard/project/YOUR_PROJECT_ID
```

### 2.2 Navegar até Edge Functions:
1. No menu lateral esquerdo, clique em **"Edge Functions"**
2. Se ainda não tiver a função criada, não se preocupe - vamos configurar as variáveis de ambiente primeiro

### 2.3 Configurar Secrets (Variáveis de Ambiente):
1. Clique na aba **"Edge Functions"** no menu lateral
2. Clique em **"Settings"** ou **"Configurações"**
3. Role até a seção **"Secrets"** ou **"Edge Function Secrets"**
4. Clique em **"Add secret"** ou **"Adicionar segredo"**

---

## 📝 Passo 3: Adicionar as variáveis de ambiente

### Variável 1: GA_PROPERTY_ID

**Name/Nome:**
```
GA_PROPERTY_ID
```

**Value/Valor:**
```
123456789
```
*(Substitua pelo seu Property ID do Google Analytics)*

Clique em **"Save"** ou **"Salvar"**

---

### Variável 2: GA_CREDENTIALS_JSON

**Name/Nome:**
```
GA_CREDENTIALS_JSON
```

**Value/Valor:**
Cole o **conteúdo completo** do arquivo JSON que você copiou no Passo 1.2

**⚠️ IMPORTANTE:**
- Cole todo o JSON em uma única linha OU
- Mantenha as quebras de linha (o Supabase aceita ambos)
- Certifique-se de que começa com `{` e termina com `}`
- Não adicione aspas extras ao redor do JSON

Clique em **"Save"** ou **"Salvar"**

---

## 📋 Passo 4: Deploy da Edge Function

### 4.1 Instalar Supabase CLI (se ainda não tiver):

**Windows:**
```bash
npm install -g supabase
```

**Mac/Linux:**
```bash
brew install supabase/tap/supabase
```

### 4.2 Login no Supabase:
```bash
supabase login
```

### 4.3 Link com seu projeto:
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

**Para encontrar o PROJECT_REF:**
- No dashboard do Supabase, clique em **Settings** > **General**
- Copie o **Reference ID**

### 4.4 Deploy da função:
```bash
cd "C:\ERP_SISTEMAS\Landepage ELI"
supabase functions deploy google-analytics
```

---

## ✅ Passo 5: Testar a integração

### 5.1 Testar no Supabase:
1. No dashboard do Supabase, vá em **Edge Functions**
2. Clique na função **"google-analytics"**
3. Clique na aba **"Invoke"** ou **"Testar"**
4. Cole este JSON no corpo da requisição:

```json
{
  "type": "realtime"
}
```

5. Clique em **"Invoke"** ou **"Executar"**
6. Você deve ver uma resposta com `activeUsers`

### 5.2 Testar no dashboard:
1. Acesse: `https://marketing.dnotas.com.br/dashboard`
2. Aguarde o carregamento
3. Você deve ver novos cards com dados do Google Analytics

---

## 🔍 Verificação

### ✅ Configuração correta:

**No Supabase Secrets, você deve ter:**
```
GA_PROPERTY_ID = 123456789
GA_CREDENTIALS_JSON = {conteúdo completo do JSON}
```

**A Edge Function deve estar:**
- ✅ Deployed (implementada)
- ✅ Active (ativa)
- ✅ Respondendo às requisições

---

## ❓ Solução de Problemas

### Erro: "Missing Google Analytics credentials"
**Solução:**
- Verifique se as variáveis `GA_PROPERTY_ID` e `GA_CREDENTIALS_JSON` estão configuradas corretamente
- Verifique se os nomes estão exatamente como especificado (case-sensitive)
- Faça redeploy da função: `supabase functions deploy google-analytics`

### Erro: "Invalid credentials"
**Solução:**
- Verifique se o JSON foi colado corretamente (sem espaços extras no início/fim)
- Verifique se o JSON é válido (pode testar em jsonlint.com)
- Certifique-se de que copiou o arquivo completo

### Erro: "Permission denied"
**Solução:**
- Volte ao Google Analytics
- Verifique se o e-mail da Service Account tem permissão "Visualizador"
- Aguarde até 10 minutos para a permissão propagar

### Erro: "Property not found"
**Solução:**
- Verifique se o Property ID está correto
- Use o número de 9 dígitos, não o Measurement ID (G-XXXXXXXXXX)
- Vá em Google Analytics > Admin > Property Details para confirmar

### Função não aparece no dashboard:
**Solução:**
- Execute: `supabase functions deploy google-analytics --no-verify-jwt`
- Aguarde 1-2 minutos para o deploy completar
- Recarregue a página do dashboard

---

## 🔐 Segurança

### ✅ Boas práticas implementadas:
- Credenciais armazenadas como Secrets (criptografadas)
- Nunca expostas no código frontend
- Função serverless com autenticação
- CORS configurado apenas para domínios autorizados

### ⚠️ NUNCA faça:
- ❌ Commit o arquivo JSON no Git
- ❌ Compartilhe as credenciais publicamente
- ❌ Use as credenciais no código frontend
- ❌ Exponha o Property ID sem necessidade

---

## 📧 Informações para TI

**Após configurar, informe à equipe:**
```
✅ Variáveis de ambiente configuradas no Supabase
✅ Edge Function "google-analytics" deployed
✅ Integração Google Analytics ativa
✅ Dashboard atualizado com novos dados

Acesso ao dashboard: https://marketing.dnotas.com.br/dashboard
```

---

## 📚 Referências

**Supabase Edge Functions:**
- https://supabase.com/docs/guides/functions

**Supabase Secrets:**
- https://supabase.com/docs/guides/functions/secrets

**Google Analytics Data API:**
- https://developers.google.com/analytics/devguides/reporting/data/v1

---

**Tempo estimado:** 10-15 minutos

**Dificuldade:** Média

🚀 Após configurar, o dashboard exibirá dados do Google Analytics em tempo real!
