# 🚀 Deploy no Servidor Próprio - Registro.br

## 📋 Pré-requisitos

Você precisa ter:
- ✅ Servidor/Hospedagem ativa (VPS, Shared Hosting, etc.)
- ✅ Domínio registrado no Registro.br (`dnotas.com.br`)
- ✅ Acesso SSH ou FTP ao servidor
- ✅ Node.js instalado no servidor (se for VPS)

---

## 🔧 Passo 1: Gerar Build de Produção

No seu computador local:

```bash
cd "C:\ERP_SISTEMAS\Landepage ELI"
npm run build
```

Isso vai criar a pasta `dist/` com todos arquivos otimizados para produção.

**Importante**: O vídeo (`public/videos/marketing-video.mp4`) será copiado para `dist/videos/`

---

## 📤 Passo 2: Fazer Upload dos Arquivos

### Opção A: Via FTP (Mais Simples)

1. **Abra seu cliente FTP** (FileZilla, WinSCP, etc.)

2. **Conecte no servidor**:
   - Host: `ftp.dnotas.com.br` (ou IP do servidor)
   - Usuário: [seu usuário FTP]
   - Senha: [sua senha]
   - Porta: 21 (FTP) ou 22 (SFTP)

3. **Navegue até a pasta pública**:
   - Geralmente é: `/public_html/` ou `/www/` ou `/htdocs/`

4. **Para criar subdomínio `landingpage.dnotas.com.br`**:
   - Crie pasta: `/public_html/landingpage/`
   - OU configure no painel de controle (cPanel/Plesk)

5. **Faça upload de TUDO dentro da pasta `dist/`**:
   ```
   dist/
   ├── index.html          → Enviar para servidor
   ├── assets/             → Enviar para servidor
   ├── videos/             → Enviar para servidor (CUIDADO: 4.3 GB!)
   └── ...                 → Enviar tudo
   ```

6. **⚠️ IMPORTANTE**: O vídeo é muito grande (4.3 GB)!
   - Upload via FTP pode demorar horas
   - Considere comprimir antes ou usar CDN

---

### Opção B: Via SSH/SCP (Mais Rápido)

Se você tem acesso SSH ao servidor:

```bash
# Gerar build
npm run build

# Enviar arquivos via SCP
scp -r dist/* usuario@seu-servidor.com:/caminho/para/pasta/publica/

# OU usando rsync (melhor para arquivos grandes)
rsync -avz --progress dist/ usuario@seu-servidor.com:/caminho/para/pasta/publica/
```

---

## 🌐 Passo 3: Configurar DNS no Registro.br

### Para domínio principal (dnotas.com.br)

1. **Acesse**: [registro.br](https://registro.br)
2. **Entre na sua conta**
3. **Vá em**: Meus Domínios → `dnotas.com.br` → DNS
4. **Configure os registros A**:

```
Tipo: A
Nome: @
Valor: [IP do seu servidor]
TTL: 3600
```

### Para subdomínio (landingpage.dnotas.com.br)

**Opção 1: Registro A**
```
Tipo: A
Nome: landingpage
Valor: [IP do seu servidor]
TTL: 3600
```

**Opção 2: CNAME (se estiver usando outro domínio)**
```
Tipo: CNAME
Nome: landingpage
Valor: seu-servidor.com.br
TTL: 3600
```

### Baseado nas suas imagens, você tem várias opções:

Você já tem subdominios como:
- `api.dnotas.com.br`
- `bd00.dnotas.com.br`
- `www.dnotas.com.br`

**Para criar `landingpage.dnotas.com.br`**, adicione:

```
Tipo: A
Nome: landingpage
Valor: [IP do servidor onde fez upload]
TTL: 3600
```

**OU** se for usar um servidor diferente dos outros:
```
Tipo: A
Nome: landingpage
Valor: [Novo IP]
TTL: 3600
```

---

## 🔧 Passo 4: Configurar o Servidor Web

### Se Usar Apache (.htaccess)

Crie arquivo `.htaccess` na pasta onde fez upload:

```apache
# .htaccess
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Compressão GZIP
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript
</IfModule>

# Cache de arquivos estáticos
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType video/mp4 "access plus 1 year"
</IfModule>
```

---

### Se Usar Nginx (nginx.conf)

Adicione no arquivo de configuração:

```nginx
server {
    listen 80;
    server_name landingpage.dnotas.com.br;

    root /caminho/para/pasta/dist;
    index index.html;

    # Compressão Gzip
    gzip on;
    gzip_types text/css application/javascript video/mp4;

    # SPA - Sempre retornar index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache para arquivos estáticos
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Cache para vídeos
    location ~* \.(mp4|webm|mov)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Depois:
```bash
sudo nginx -t          # Testar configuração
sudo systemctl reload nginx  # Recarregar Nginx
```

---

## 🔒 Passo 5: Configurar SSL (HTTPS)

### Opção 1: Let's Encrypt (GRÁTIS)

Se tem SSH no servidor:

```bash
# Instalar Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Gerar certificado SSL
sudo certbot --nginx -d landingpage.dnotas.com.br

# Renovação automática (testar)
sudo certbot renew --dry-run
```

### Opção 2: Painel de Controle (cPanel/Plesk)

1. Acesse seu painel
2. Vá em "SSL/TLS"
3. Selecione "Let's Encrypt SSL"
4. Escolha o domínio `landingpage.dnotas.com.br`
5. Clique em "Instalar"

---

## ⚠️ PROBLEMA: Vídeo Muito Grande (4.3 GB)

### Soluções:

#### Solução 1: Comprimir o Vídeo (Recomendado)

```bash
# Instalar FFmpeg
# Windows: https://ffmpeg.org/download.html

# Comprimir vídeo
cd "C:\ERP_SISTEMAS\Landepage ELI\public\videos"
ffmpeg -i marketing-video.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k marketing-video-compressed.mp4

# Substituir
del marketing-video.mp4
ren marketing-video-compressed.mp4 marketing-video.mp4

# Fazer build novamente
cd "C:\ERP_SISTEMAS\Landepage ELI"
npm run build

# Fazer upload novamente
```

Isso vai reduzir de 4.3 GB para ~500 MB.

---

#### Solução 2: Hospedar Vídeo em CDN (Ideal)

**Cloudflare Stream** (Recomendado):

1. Criar conta em [cloudflare.com](https://cloudflare.com)
2. Ir em "Stream"
3. Fazer upload do vídeo
4. Copiar a URL
5. Editar `src/pages/LandingPage.tsx`:

```typescript
// Trocar de:
url="/videos/marketing-video.mp4"

// Para:
url="https://customer-xxxxx.cloudflarestream.com/SEU_VIDEO_ID/manifest/video.m3u8"
```

6. Fazer build e upload novamente (sem o vídeo, muito menor!)

**Vantagens**:
- ✅ Carregamento 10x mais rápido
- ✅ Não usa banda do seu servidor
- ✅ Adaptive streaming (ajusta qualidade)
- ✅ Funciona melhor no mobile

**Custo**: ~$5/mês para 1000 minutos de visualização

---

## 📊 Passo 6: Testar Tudo

### Checklist:

- [ ] Site abre em: `http://landingpage.dnotas.com.br`
- [ ] HTTPS funciona: `https://landingpage.dnotas.com.br`
- [ ] Vídeo carrega e toca
- [ ] Aos 11:27 o CTA aparece
- [ ] Formulário salva leads no Supabase
- [ ] Dashboard funciona: `https://landingpage.dnotas.com.br/dashboard`
- [ ] UTMs funcionam: `?utm_source=teste&utm_medium=teste&utm_campaign=teste`
- [ ] WhatsApp funciona (botão flutuante)
- [ ] Tudo funciona no mobile

---

## 🔄 Atualizações Futuras

Sempre que fizer alterações:

```bash
# 1. Fazer alterações no código
# 2. Testar localmente
npm run dev

# 3. Gerar novo build
npm run build

# 4. Fazer upload apenas dos arquivos alterados
# Via FTP ou SCP
```

**Dica**: Configure deploy automático via GitHub Actions (opcional).

---

## 🌐 Estrutura Final

```
Servidor: 185.199.XXX.XXX (ou seu IP)
├── public_html/
│   └── landingpage/           ← Upload dos arquivos aqui
│       ├── index.html
│       ├── assets/
│       │   ├── index-XXX.js
│       │   └── index-XXX.css
│       └── videos/
│           └── marketing-video.mp4 (4.3 GB ⚠️)

DNS Registro.br:
├── A: landingpage → 185.199.XXX.XXX
└── SSL: Let's Encrypt (HTTPS)

Resultado:
🌐 https://landingpage.dnotas.com.br
```

---

## 🚨 Troubleshooting

### Site não abre

**Possíveis causas**:
1. DNS não propagou (aguarde 24-48h)
2. Arquivos na pasta errada
3. Servidor não configurado corretamente

**Soluções**:
```bash
# Testar DNS
nslookup landingpage.dnotas.com.br

# Testar se servidor está respondendo
ping landingpage.dnotas.com.br

# Verificar se arquivos estão lá
ls -la /caminho/para/pasta/
```

---

### Vídeo não carrega

**Causas**:
- Vídeo muito grande (timeout)
- Falta de memória no servidor
- Limite de upload atingido

**Soluções**:
- Comprimir vídeo (Solução 1)
- Usar CDN (Solução 2)

---

### Dashboard vazio

**Causa**: Supabase não conectado

**Solução**: Verificar credenciais em `src/lib/supabase.ts`

---

### Erro 404 ao navegar

**Causa**: Servidor não está redirecionando para `index.html`

**Solução**: Configurar `.htaccess` (Apache) ou `nginx.conf` (Nginx)

---

## 📞 Próximos Passos

1. ✅ Fazer upload dos arquivos
2. ✅ Configurar DNS no Registro.br
3. ✅ Configurar SSL (HTTPS)
4. ✅ Testar tudo
5. ✅ Otimizar vídeo (comprimir ou CDN)
6. ✅ Passar URL para marketing

---

## 🎯 URLs Finais

**Landing Page**:
```
https://landingpage.dnotas.com.br
```

**Dashboard**:
```
https://landingpage.dnotas.com.br/dashboard
```

**Anúncios com UTM** (Facebook):
```
https://landingpage.dnotas.com.br/?utm_source=facebook&utm_medium=cpc&utm_campaign=lancamento
```

---

**Boa sorte com o deploy! 🚀**

*Se precisar de ajuda, consulte `PROXIMOS_PASSOS.md` ou entre em contato.*
