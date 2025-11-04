# ⚡ Deploy Rápido - Passo a Passo

## 🎯 3 Passos Principais

### 1️⃣ Gerar Build

```bash
cd "C:\ERP_SISTEMAS\Landepage ELI"
npm run build
```

✅ Isso cria a pasta `dist/` com tudo pronto para produção.

---

### 2️⃣ Fazer Upload para o Servidor

**Via FTP** (FileZilla, WinSCP):

1. Conectar no servidor
2. Ir para `/public_html/` (ou `/www/`)
3. Criar pasta `landingpage/` (se for subdomínio)
4. Fazer upload de TUDO dentro de `dist/`

**⚠️ ATENÇÃO**: O vídeo tem 4.3 GB - vai demorar!

---

### 3️⃣ Configurar DNS no Registro.br

1. Acessar [registro.br](https://registro.br)
2. Ir em DNS
3. Adicionar registro:

```
Tipo: A
Nome: landingpage
Valor: [IP do seu servidor]
TTL: 3600
```

**Aguardar**: DNS pode levar até 24h para propagar.

---

## 🌐 Resultado

Seu site estará em:
```
http://landingpage.dnotas.com.br
```

Dashboard em:
```
http://landingpage.dnotas.com.br/dashboard
```

---

## ⚡ Otimização do Vídeo (IMPORTANTE!)

O vídeo está muito grande (4.3 GB). **Comprima antes de fazer upload**:

### Opção 1: Comprimir (Reduz para ~500 MB)

1. Instale [FFmpeg](https://ffmpeg.org/download.html)

2. Execute:
```bash
cd "C:\ERP_SISTEMAS\Landepage ELI\public\videos"

ffmpeg -i marketing-video.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k marketing-video-compressed.mp4
```

3. Substitua:
```bash
del marketing-video.mp4
ren marketing-video-compressed.mp4 marketing-video.mp4
```

4. Refaça o build:
```bash
cd "C:\ERP_SISTEMAS\Landepage ELI"
npm run build
```

5. Faça upload novamente (muito mais rápido!)

---

### Opção 2: Use CDN (Ideal)

**Cloudflare Stream** (~$5/mês):
- Upload do vídeo lá
- Troque a URL no código
- Site fica 10x mais rápido!

Veja detalhes em: `DEPLOY_SERVIDOR.md` ou `VIDEO_SETUP.md`

---

## ✅ Checklist Final

Antes de passar para o marketing:

- [ ] Build gerado (`npm run build`)
- [ ] Arquivos enviados para servidor
- [ ] DNS configurado no Registro.br
- [ ] Site abrindo (aguardar propagação DNS)
- [ ] Vídeo comprimido ou em CDN
- [ ] SSL configurado (HTTPS)
- [ ] Tudo testado (mobile + desktop)
- [ ] Dashboard funcionando

---

## 📞 Próximo Passo

Depois que o site estiver no ar:
1. Teste tudo
2. Configure SSL (HTTPS) - veja `DEPLOY_SERVIDOR.md`
3. Envie `GUIA_MARKETING.md` para o time
4. Passe as URLs:
   - Landing: `https://landingpage.dnotas.com.br`
   - Dashboard: `https://landingpage.dnotas.com.br/dashboard`

---

## 📚 Documentação Completa

- `DEPLOY_SERVIDOR.md` - **Guia detalhado de deploy**
- `VIDEO_SETUP.md` - Como otimizar o vídeo
- `GUIA_MARKETING.md` - Para o time de marketing
- `PROXIMOS_PASSOS.md` - Checklist completo

---

**Qualquer dúvida, consulte `DEPLOY_SERVIDOR.md`! 🚀**
