# 🎥 Google Drive - Setup em 5 Minutos (GRÁTIS!)

## ⚡ 5 Passos Rápidos

### 1️⃣ Upload no Google Drive

1. Acesse: [drive.google.com](https://drive.google.com)
2. Clique em **"Novo"** → **"Upload de arquivo"**
3. Selecione: `C:\ERP_SISTEMAS\Landepage ELI\public\videos\marketing-video.mp4`
4. Aguarde upload (pode levar 30-60 min para 4.3 GB)

---

### 2️⃣ Compartilhar Publicamente

1. **Botão direito** no vídeo → **"Compartilhar"**
2. Em **"Acesso geral"** → Trocar para **"Qualquer pessoa com o link"**
3. Permissão: **"Visualizador"**
4. Clicar em **"Copiar link"**

Você verá algo assim:
```
https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J/view?usp=sharing
```

---

### 3️⃣ Extrair o ID do Arquivo

Do link acima, copie **APENAS** a parte entre `/d/` e `/view`:

**Exemplo**:
```
Link completo:
https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J/view?usp=sharing
                           ^^^^^^^^^^^^^^^^^^^^^^^^^
                           Copie apenas esta parte (o ID)
```

**ID extraído**:
```
1A2B3C4D5E6F7G8H9I0J
```

---

### 4️⃣ Montar URL de Streaming

Use esta fórmula:
```
https://drive.google.com/uc?export=download&id=SEU_ID_AQUI
```

**Substitua** `SEU_ID_AQUI` pelo ID que você copiou.

**Exemplo com ID real**:
```
https://drive.google.com/uc?export=download&id=1A2B3C4D5E6F7G8H9I0J
```

---

### 5️⃣ Atualizar o Código

**Abrir**: `C:\ERP_SISTEMAS\Landepage ELI\src\pages\LandingPage.tsx`

**Linha 66** - Trocar:

```typescript
// DE (vídeo local):
url="/videos/marketing-video.mp4"

// PARA (Google Drive):
url="https://drive.google.com/uc?export=download&id=SEU_ID_AQUI"
```

⚠️ **Não esqueça** de substituir `SEU_ID_AQUI` pelo ID real!

---

## ✅ Testar

```bash
# 1. Testar localmente
cd "C:\ERP_SISTEMAS\Landepage ELI"
npm run dev

# 2. Abrir no navegador
# http://localhost:5173

# 3. Verificar se vídeo carrega e toca
```

**Checklist**:
- [ ] Vídeo carrega?
- [ ] Vídeo toca?
- [ ] Aos 11:27 o CTA aparece?
- [ ] Formulário funciona?

✅ **Se tudo funcionar**, próximo passo!

---

## 🚀 Deploy

```bash
# 1. Deletar vídeo local (opcional mas recomendado)
del "C:\ERP_SISTEMAS\Landepage ELI\public\videos\marketing-video.mp4"

# 2. Fazer build (agora vai ser ~2 MB ao invés de 4.3 GB!)
npm run build

# 3. Upload para servidor via FTP
# → Vai levar SEGUNDOS ao invés de horas! 🚀
```

---

## 📊 Resultado

**Antes**:
- Build: 4.3 GB
- Upload: 2-5 horas
- Custo servidor: $$$

**Depois**:
- Build: 2 MB
- Upload: 30 segundos
- Custo: R$ 0,00! 🎉

---

## ⚠️ Limitações

**Cota do Google Drive**:
- ~174 visualizações/dia = OK
- Se ultrapassar → bloqueia 24h

**Se tiver muito tráfego**:
- Migrar para Internet Archive (ilimitado)
- Ou criar múltiplas cópias no Drive

---

## 🆘 Problemas?

### "Quota Exceeded"

**Significa**: Muitas pessoas assistindo

**Solução Rápida**: Criar 2-3 cópias do vídeo e usar URLs diferentes

---

### Vídeo não carrega

**Verificar**:
1. ✅ Link está público? (Qualquer pessoa com o link)
2. ✅ ID copiado corretamente?
3. ✅ URL no formato: `https://drive.google.com/uc?export=download&id=...`

**Testar**: Abrir URL no navegador → deve fazer download!

---

### Erro no código

**Verificar**:
1. ✅ Aspas corretas? (não pode ter espaços)
2. ✅ ID completo copiado?
3. ✅ Não tem `/view` no final?

---

## 📚 Exemplo Completo

### Passo a Passo Real:

**1. Upload e compartilhamento no Drive** ✅

**2. Link copiado**:
```
https://drive.google.com/file/d/1aBcDeFgHiJkLmNoPqRsTuVwXyZ/view?usp=sharing
```

**3. ID extraído**:
```
1aBcDeFgHiJkLmNoPqRsTuVwXyZ
```

**4. URL montada**:
```
https://drive.google.com/uc?export=download&id=1aBcDeFgHiJkLmNoPqRsTuVwXyZ
```

**5. Código atualizado**:
```typescript
<VideoPlayer
  url="https://drive.google.com/uc?export=download&id=1aBcDeFgHiJkLmNoPqRsTuVwXyZ"
  leadId={leadId}
  onTimeUpdate={handleVideoTimeUpdate}
  showControlsAfter={687}
  className="aspect-video w-full"
/>
```

**6. Testar e deploy** ✅

---

## ✅ Checklist Final

- [ ] Vídeo no Google Drive
- [ ] Compartilhamento público ativado
- [ ] Link copiado
- [ ] ID extraído corretamente
- [ ] URL montada
- [ ] Código atualizado (linha 66)
- [ ] Testado localmente - funciona!
- [ ] Vídeo local deletado (opcional)
- [ ] Build gerado
- [ ] Deploy feito
- [ ] Testado em produção - funciona!

---

## 🎯 Tempo Total

- Upload no Drive: 30-60 min (depende da internet)
- Setup do código: 2 min
- Build: 1 min
- Deploy: 30 segundos

**Total**: ~1 hora (a maior parte é upload)

---

## 💡 Dica

Faça o upload enquanto trabalha em outra coisa. Quando terminar, é só copiar o ID e atualizar o código!

---

**Pronto! 100% gratuito e funcionando! 🎉**

Dúvidas? Veja `HOSPEDAGEM_VIDEO_GRATIS.md` para mais detalhes.
