# 🌐 Configurar DNS no Registro.br - 5 Minutos

## ✅ Deploy Concluído!

O site já está no GitHub Pages, agora só falta configurar o DNS!

---

## 📋 Passo a Passo

### 1️⃣ Acessar Registro.br

1. Acesse: **https://registro.br/**
2. Fazer login com sua conta
3. Ir em **"Meus domínios"**
4. Selecionar: **dnotas.com.br**

---

### 2️⃣ Configurar DNS

1. Clicar em **"Editar Zona"** ou **"Gerenciar DNS"**
2. Procurar por **"Adicionar registro"** ou **"Nova entrada"**
3. Adicionar o seguinte registro:

```
Tipo: CNAME
Nome: landingpage
Valor: uiwill.github.io
TTL: 3600 (ou padrão)
```

4. **Salvar**

---

### 3️⃣ Configurar no GitHub (Opcional)

Caso o GitHub peça para verificar o domínio:

1. Acesse: https://github.com/UiWill/marketing-notas/settings/pages
2. Em **"Custom domain"**: Deve aparecer `landingpage.dnotas.com.br`
3. Marcar **"Enforce HTTPS"** ✅
4. **Aguardar** certificado SSL ser gerado (10-30 min)

---

## ⏰ Tempo de Propagação

- **Mínimo**: 5-10 minutos
- **Máximo**: 24 horas (raro)
- **Média**: 30 minutos

---

## 🧪 Testar

### Durante propagação (funciona já):
```
http://landingpage.dnotas.com.br
```

### Depois de SSL ativado (10-30 min):
```
https://landingpage.dnotas.com.br
```

---

## ✅ Quando Funcionar

Você vai acessar: **https://landingpage.dnotas.com.br**

E vai ver:
- ✅ Vídeo do YouTube
- ✅ CTA aos 11:27
- ✅ Formulário funcionando
- ✅ URL limpa (sem /marketing-notas/)

---

## 🔍 Verificar Status DNS

Para ver se propagou:

**Windows (CMD)**:
```bash
nslookup landingpage.dnotas.com.br
```

**Deve retornar**: `uiwill.github.io`

**Online**:
- https://dnschecker.org/
- Colocar: `landingpage.dnotas.com.br`
- Tipo: `CNAME`

---

## 🆘 Problemas Comuns

### "DNS não propaga"
**Causa**: Pode levar até 30 minutos
**Solução**: Aguardar e testar novamente

### "HTTPS não ativa"
**Causa**: GitHub gerando certificado SSL
**Solução**: Aguardar 10-30 minutos após DNS propagar

### "404 - Site não encontrado"
**Causa**: DNS ainda não propagou
**Solução**: Aguardar mais um pouco

---

## 🎯 Status Atual

- ✅ **GitHub Pages**: Deploy concluído
- ✅ **CNAME**: Configurado (landingpage.dnotas.com.br)
- ✅ **Build**: base: '/' (correto para domínio customizado)
- ⏳ **DNS**: Aguardando você configurar no Registro.br
- ⏳ **SSL**: Será ativado após DNS propagar

---

## 📞 Próximo Passo

1. **AGORA**: Configurar CNAME no Registro.br
2. **Aguardar**: 5-30 minutos
3. **Testar**: http://landingpage.dnotas.com.br
4. **Aguardar**: Mais 10-30 min para HTTPS
5. **Pronto**: https://landingpage.dnotas.com.br ✅

---

**Vai lá configurar o DNS no Registro.br! 🚀**

Depois me avisa quando propagar!
