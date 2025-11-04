# 🚀 Deploy para GitHub Pages - Guia Completo

## ✅ Configuração Feita

- ✅ `vite.config.ts` com `base: '/'` (funciona com domínio customizado)
- ✅ `package.json` com scripts de deploy
- ✅ `public/CNAME` criado com `landingpage.dnotas.com.br`
- ✅ Vídeo do YouTube integrado

---

## 🚀 Deploy em 3 Comandos

```bash
# 1. Fazer commit das últimas mudanças
git add . && git commit -m "fix: Reverter base URL para funcionamento correto"

# 2. Push para GitHub
git push origin main

# 3. Deploy para GitHub Pages
npm run deploy
```

**Pronto!** O site vai para: `https://uiwill.github.io/marketing-notas/`

---

## 🌐 Configurar Domínio Customizado (landingpage.dnotas.com.br)

### No Registro.br (Gerenciador DNS):

1. Acesse: https://registro.br/
2. Login → Meus domínios → `dnotas.com.br`
3. Editar zona DNS
4. Adicionar registro:

```
Tipo: CNAME
Nome: landingpage
Valor: uiwill.github.io
TTL: 3600
```

**Resultado**: `landingpage.dnotas.com.br` → GitHub Pages

---

### No GitHub (Configurar Pages):

1. Acesse: https://github.com/UiWill/marketing-notas
2. Settings → Pages
3. **Source**: Deploy from a branch
4. **Branch**: `gh-pages` / `root`
5. **Custom domain**: `landingpage.dnotas.com.br`
6. **Enforce HTTPS**: ✅ (marcar)
7. Save

---

## ⏰ Tempo de Propagação

- **DNS**: 5-10 minutos (pode levar até 24h)
- **SSL/HTTPS**: 10-30 minutos (GitHub gera automaticamente)

---

## 🧪 Testar

### Antes do DNS propagar:
```
https://uiwill.github.io/marketing-notas/
```

### Depois do DNS propagar:
```
https://landingpage.dnotas.com.br
```

---

## 📋 Checklist Completo

**Deploy**:
- [ ] `git push origin main` (código no GitHub)
- [ ] `npm run deploy` (deploy no GitHub Pages)
- [ ] Acessar `https://uiwill.github.io/marketing-notas/` - funciona?

**Domínio Customizado**:
- [ ] Registro CNAME no Registro.br
- [ ] Configurar Custom Domain no GitHub Pages
- [ ] Aguardar propagação DNS (5-10 min)
- [ ] Acessar `https://landingpage.dnotas.com.br` - funciona?

**Validação Final**:
- [ ] Vídeo carrega e toca?
- [ ] CTA aparece aos 11:27?
- [ ] Formulário funciona?
- [ ] Dashboard funciona? (https://landingpage.dnotas.com.br/dashboard)
- [ ] Mobile funciona?
- [ ] HTTPS ativo (cadeado verde)?

---

## 🔧 Comandos Úteis

### Deploy:
```bash
npm run deploy
```

### Re-deploy após mudanças:
```bash
git add .
git commit -m "feat: Nova funcionalidade"
git push origin main
npm run deploy
```

### Testar build localmente antes de deploy:
```bash
npm run build
npm run preview
```

---

## 🆘 Troubleshooting

### Erro: "Failed to publish"
**Causa**: Permissões do GitHub
**Solução**:
1. GitHub → Settings → Actions → General
2. Workflow permissions → Read and write permissions
3. Save

### Site não carrega (404)
**Causa**: Branch errada no GitHub Pages
**Solução**:
1. Settings → Pages
2. Trocar branch para `gh-pages`
3. Aguardar 1-2 minutos

### Domínio customizado não funciona
**Causa**: DNS ainda propagando
**Solução**: Aguardar 10-30 minutos

### CSS não carrega
**Causa**: Base URL errada
**Solução**: `vite.config.ts` deve ter `base: '/'` (já está correto!)

### HTTPS não ativado
**Causa**: Ainda gerando certificado
**Solução**: Aguardar 10-30 minutos após configurar domínio

---

## 🎯 Fluxo de Atualização

Sempre que fizer mudanças:

```bash
# 1. Commit
git add .
git commit -m "Descrição da mudança"

# 2. Push
git push origin main

# 3. Deploy
npm run deploy

# 4. Testar
# Aguardar 1-2 minutos
# Acessar: https://landingpage.dnotas.com.br
```

---

## 📊 Status Atual

- ✅ Repositório: `https://github.com/UiWill/marketing-notas`
- ✅ Vídeo: YouTube integrado
- ✅ Código: Pronto para deploy
- ⏳ GitHub Pages: Aguardando deploy
- ⏳ DNS: Aguardando configuração

---

## ⚡ Próximos Passos AGORA

1. **Commit e push**:
```bash
git add .
git commit -m "fix: Reverter base URL e adicionar CNAME"
git push origin main
```

2. **Deploy**:
```bash
npm run deploy
```

3. **Testar**:
- Acessar: `https://uiwill.github.io/marketing-notas/`
- Verificar se tudo funciona

4. **Configurar domínio** (depois):
- CNAME no Registro.br
- Custom domain no GitHub

---

**Rode os comandos e me avise como foi! 🚀**
