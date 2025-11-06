# 📊 Guia de Configuração da API do Google Analytics

## Objetivo
Integrar o Google Analytics diretamente no dashboard interno da Dnotas, permitindo visualizar métricas de tráfego sem precisar acessar o site do Google Analytics.

---

## 🎯 O que será integrado:

No dashboard interno você verá:
- ✅ **Usuários ativos em tempo real**
- ✅ **Sessões totais por período**
- ✅ **Visualizações de página**
- ✅ **Taxa de rejeição**
- ✅ **Duração média da sessão**
- ✅ **Principais páginas visitadas**
- ✅ **Fontes de tráfego** (Google, Facebook, direto, etc.)
- ✅ **Dispositivos** (mobile, desktop, tablet)
- ✅ **Localização geográfica**

---

## 📋 Passo 1: Habilitar a Google Analytics Data API

### 1.1 Acesse o Google Cloud Console:
```
https://console.cloud.google.com/
```

### 1.2 Criar um novo projeto (ou usar existente):
1. No topo da página, clique no seletor de projetos
2. Clique em **"Novo Projeto"** ou **"New Project"**
3. Nome do projeto: **"Dnotas Analytics"**
4. Clique em **"Criar"** ou **"Create"**
5. Aguarde a criação (15-30 segundos)
6. Selecione o projeto criado

### 1.3 Habilitar a API:
1. No menu lateral, vá em **"APIs e Serviços"** > **"Biblioteca"**
   - Ou acesse: https://console.cloud.google.com/apis/library
2. No campo de busca, digite: **"Google Analytics Data API"**
3. Clique em **"Google Analytics Data API"**
4. Clique no botão azul **"Ativar"** ou **"Enable"**
5. Aguarde a ativação

---

## 📋 Passo 2: Criar Credenciais (Service Account)

### 2.1 Acessar credenciais:
1. No menu lateral, vá em **"APIs e Serviços"** > **"Credenciais"**
   - Ou acesse: https://console.cloud.google.com/apis/credentials
2. Clique no botão **"+ Criar Credenciais"** no topo
3. Selecione **"Conta de serviço"** ou **"Service Account"**

### 2.2 Configurar a conta de serviço:
**Etapa 1 - Detalhes da conta de serviço:**
- **Nome da conta de serviço:** `dnotas-analytics-reader`
- **ID da conta de serviço:** (gerado automaticamente)
- **Descrição:** `Acesso de leitura ao Google Analytics para dashboard Dnotas`
- Clique em **"Criar e continuar"**

**Etapa 2 - Conceder acesso:**
- **Papel/Role:** Selecione **"Visualizador"** ou **"Viewer"**
- Clique em **"Continuar"**

**Etapa 3 - Conceder acesso aos usuários (opcional):**
- Deixe em branco
- Clique em **"Concluir"**

### 2.3 Criar chave JSON:
1. Na lista de contas de serviço, encontre **"dnotas-analytics-reader"**
2. Clique nos **três pontos** (⋮) no final da linha
3. Clique em **"Gerenciar chaves"** ou **"Manage keys"**
4. Clique em **"Adicionar chave"** > **"Criar nova chave"**
5. Selecione formato: **JSON**
6. Clique em **"Criar"**
7. **Um arquivo JSON será baixado automaticamente**

**⚠️ IMPORTANTE: Guarde este arquivo JSON com segurança! Ele contém as credenciais.**

### 2.4 Copiar o e-mail da Service Account:
1. Na tela de credenciais, clique na conta de serviço **"dnotas-analytics-reader"**
2. Copie o **e-mail** que aparece (formato: `dnotas-analytics-reader@projeto.iam.gserviceaccount.com`)

---

## 📋 Passo 3: Dar acesso ao Google Analytics

### 3.1 Acessar configurações do Google Analytics:
```
https://analytics.google.com/
```

### 3.2 Adicionar usuário:
1. No canto inferior esquerdo, clique no ícone de **engrenagem** ⚙️ (Administrador)
2. Na coluna **"Propriedade"**, clique em **"Acesso à propriedade"**
3. Clique no botão azul **"+"** no canto superior direito
4. Selecione **"Adicionar usuários"**

### 3.3 Configurar permissões:
- **Endereço de e-mail:** Cole o e-mail da Service Account
  - Exemplo: `dnotas-analytics-reader@projeto.iam.gserviceaccount.com`
- **Papéis:**
  - Marque: ✅ **"Visualizador"** ou **"Viewer"**
  - NÃO marque "Editor" ou "Administrador"
- **Notificar este usuário por e-mail:** Desmarque (não é necessário)
- Clique em **"Adicionar"**

---

## 📋 Passo 4: Obter o Property ID do Google Analytics

### 4.1 Na tela de Admin do Google Analytics:
1. No canto inferior esquerdo, clique no ícone de **engrenagem** ⚙️
2. Na coluna **"Propriedade"**, clique em **"Detalhes da propriedade"**
3. Copie o **ID da propriedade**
   - Formato: número com 9 dígitos
   - Exemplo: `123456789`
   - **Não confunda com o Measurement ID (G-XXXXXXXXXX)**

**Alternativa:**
1. Na lista de propriedades, o número aparece entre parênteses
2. Exemplo: "Dnotas Marketing (123456789)"

---

## 📦 Passo 5: Enviar arquivos para equipe de TI

### O que você precisa enviar:

**1. Arquivo JSON de credenciais**
- Nome do arquivo: `dnotas-analytics-xxxxxxxxx.json` (baixado no Passo 2.3)
- **Envie este arquivo por e-mail seguro ou drive compartilhado**

**2. Property ID do Google Analytics**
```
Property ID: 123456789
```

**3. Measurement ID (já temos)**
```
Measurement ID: G-4ZH7JJL2YK
```

---

## 📧 Modelo de E-mail para TI:

```
Assunto: Credenciais Google Analytics API - Dashboard Dnotas

Olá equipe de TI,

Segue as credenciais para integração do Google Analytics no dashboard:

1. Arquivo JSON de credenciais: [ANEXADO]
2. Property ID: 123456789
3. Measurement ID: G-4ZH7JJL2YK

O arquivo JSON contém as credenciais da Service Account que tem permissão
de leitura no Google Analytics.

Qualquer dúvida, estou à disposição.

Obrigado!
```

---

## 🔐 Segurança

### ⚠️ IMPORTANTE:
- O arquivo JSON contém credenciais sensíveis
- **NUNCA** compartilhe publicamente
- **NUNCA** commit no GitHub
- Envie apenas por canais seguros (e-mail corporativo, drive privado)
- A Service Account tem apenas permissão de LEITURA (não pode alterar nada)

### ✅ Permissões concedidas:
- ✅ Ler dados do Google Analytics
- ❌ NÃO pode modificar propriedades
- ❌ NÃO pode adicionar/remover usuários
- ❌ NÃO pode alterar configurações

---

## 🎯 O que acontece depois:

Após enviar as credenciais:
1. ✅ A equipe de TI configurará o backend
2. ✅ O dashboard será atualizado com novos gráficos
3. ✅ Você verá dados do Google Analytics em tempo real
4. ✅ Não precisará mais acessar o site do Google Analytics para métricas básicas

---

## 📊 Métricas que aparecerão no Dashboard:

### Cards principais:
- **Usuários ativos (últimas 30 minutos)**
- **Sessões (hoje, ontem, últimos 7 dias)**
- **Visualizações de página**
- **Taxa de rejeição**

### Gráficos:
- **Sessões por dia** (últimos 30 dias)
- **Fontes de tráfego** (top 10)
- **Páginas mais visitadas**
- **Dispositivos** (mobile vs desktop)
- **Localização geográfica** (top 10 cidades)

### Tempo real:
- **Usuários ativos agora**
- **Páginas sendo visualizadas**
- **Eventos em tempo real**

---

## ❓ Solução de Problemas

### Erro: "Permission denied"
- Verifique se o e-mail da Service Account foi adicionado no Google Analytics
- Verifique se a permissão é "Visualizador" ou superior

### Erro: "API not enabled"
- Volte ao Google Cloud Console
- Verifique se a "Google Analytics Data API" está ativada

### Erro: "Invalid credentials"
- Verifique se o arquivo JSON foi enviado corretamente
- Verifique se não corrompeu durante o envio

### Não aparece dados no dashboard:
- Aguarde até 24 horas após a configuração
- Verifique se há tráfego no site
- Acesse o site para gerar pelo menos 1 visita

---

## 📚 Referências

**Google Analytics Data API:**
- https://developers.google.com/analytics/devguides/reporting/data/v1

**Service Accounts:**
- https://cloud.google.com/iam/docs/service-accounts

**Documentação oficial:**
- https://support.google.com/analytics/answer/1009702

---

## ✅ Checklist

- [ ] Criei projeto no Google Cloud Console
- [ ] Habilitei a Google Analytics Data API
- [ ] Criei Service Account "dnotas-analytics-reader"
- [ ] Baixei o arquivo JSON de credenciais
- [ ] Copiei o e-mail da Service Account
- [ ] Adicionei o e-mail no Google Analytics com permissão "Visualizador"
- [ ] Copiei o Property ID
- [ ] Enviei o arquivo JSON e Property ID para equipe de TI

---

**Tempo estimado:** 15-20 minutos

**Dificuldade:** Média

**Suporte:** Se precisar de ajuda, entre em contato com a equipe de TI.

🚀 Após a configuração, seu dashboard terá dados completos do Google Analytics integrados!
