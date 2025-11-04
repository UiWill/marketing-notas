# ⚡ Quick Start - Landing Page Dnotas

## 🎯 3 Passos Para Colocar no Ar

### 1️⃣ Deploy (5 minutos)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Fazer deploy
cd "C:\ERP_SISTEMAS\Landepage ELI"
vercel

# Seguir instruções na tela
# URL será gerada automaticamente (ex: dnotas-landing.vercel.app)
```

✅ **Pronto! Site no ar!**

---

### 2️⃣ Configurar Número do WhatsApp

**Arquivo**: `src/pages/LandingPage.tsx` (linha 647)

**Trocar**:
```typescript
https://wa.me/5511999999999
```

**Por**:
```typescript
https://wa.me/5511SEUNUMERO
```

Formato: `55` + `DDD` + `número` (sem espaços)

Exemplo: `5511987654321`

---

### 3️⃣ Passar Para o Marketing

**Enviar**:
1. **URL do site**: https://seu-dominio.vercel.app
2. **URL do dashboard**: https://seu-dominio.vercel.app/dashboard
3. **Arquivo**: `GUIA_MARKETING.md`

---

## 📱 URLs com UTM (Para Anúncios)

### Facebook Ads
```
https://seu-dominio.com/?utm_source=facebook&utm_medium=cpc&utm_campaign=lancamento
```

### Google Ads
```
https://seu-dominio.com/?utm_source=google&utm_medium=cpc&utm_campaign=search
```

### Instagram
```
https://seu-dominio.com/?utm_source=instagram&utm_medium=stories&utm_campaign=promocao
```

---

## ⚠️ IMPORTANTE: Otimizar Vídeo (Depois)

O vídeo atual (4.3 GB) é muito pesado!

**Solução Rápida** (Comprimir):
```bash
ffmpeg -i marketing-video.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k marketing-video-compressed.mp4
```

**Solução Ideal** (CDN):
- Use Cloudflare Stream (~$5/mês)
- Ou Vimeo Pro (~$75/ano)

Veja detalhes em: `VIDEO_SETUP.md`

---

## 📊 Acessar Dashboard

```
https://seu-dominio.com/dashboard
```

**O que você verá**:
- Visitantes únicos
- Taxa de conversão
- Funil completo
- Fontes de tráfego
- Lista de leads

---

## ✅ Checklist Mínimo

- [x] Supabase configurado ✅
- [x] Build funcionando ✅
- [ ] Deploy no Vercel
- [ ] Número WhatsApp correto
- [ ] Testar site (desktop + mobile)
- [ ] Testar dashboard
- [ ] Enviar para marketing

---

## 📚 Documentação Completa

- `GUIA_MARKETING.md` → Para o time de marketing
- `PROXIMOS_PASSOS.md` → Todos os passos detalhados
- `TRACKING_SETUP.md` → Como funciona o tracking
- `VIDEO_SETUP.md` → Otimização do vídeo

---

## 🆘 Problemas?

### Site não abre
→ Verifique se deploy foi feito com sucesso

### Dashboard vazio
→ Verifique se executou o SQL no Supabase

### Vídeo lento
→ Comprima ou use CDN (veja `VIDEO_SETUP.md`)

### Leads não aparecem
→ Verifique credenciais em `src/lib/supabase.ts`

---

**Pronto para lançar! 🚀**
