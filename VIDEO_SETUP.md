# Configuração do Vídeo de Marketing

## Localização do Vídeo

O vídeo de marketing está armazenado em:
```
public/videos/marketing-video.mp4
```

**Tamanho:** 4.3 GB
**Formato:** MP4

## Comportamento do Vídeo na Landing Page

### Timing do CTA
O botão de Call-to-Action (formulário de lead) **só aparece aos 11 minutos e 27 segundos** (11:27) do vídeo.

Isso significa:
- O visitante DEVE assistir até 11:27 para ver o formulário
- Os controles do vídeo também só aparecem aos 11:27
- Até lá, o vídeo toca sem controles visíveis

### Proteções Implementadas

O vídeo possui as seguintes proteções para garantir que o visitante assista:

1. **Sem Download**: Botão de download desabilitado
2. **Sem Fullscreen**: Modo tela cheia bloqueado (até 11:27)
3. **Sem Picture-in-Picture**: PiP desabilitado
4. **Sem Menu de Contexto**: Clique direito bloqueado
5. **Sem Scrubbing**: Visitante não pode pular para frente (até 11:27)

### Tracking do Vídeo

O sistema rastreia automaticamente:
- ✅ Quando o vídeo inicia
- ✅ Progresso de visualização
- ✅ Se o visitante assistiu até 11:27
- ✅ Se abandonou antes de 11:27
- ✅ Tempo exato de abandono

## Como Substituir o Vídeo

Se precisar trocar o vídeo no futuro:

### Opção 1: Vídeo Local

1. Coloque o novo vídeo em `public/videos/`
2. Renomeie para `marketing-video.mp4` ou
3. Atualize a URL em `src/pages/LandingPage.tsx`:

```typescript
<VideoPlayer
  url="/videos/SEU-NOVO-VIDEO.mp4"
  ...
/>
```

### Opção 2: Vídeo do YouTube

```typescript
<VideoPlayer
  url="https://www.youtube.com/watch?v=VIDEO_ID"
  ...
/>
```

### Opção 3: Vídeo do Vimeo

```typescript
<VideoPlayer
  url="https://vimeo.com/VIDEO_ID"
  ...
/>
```

### Opção 4: Streaming (Recomendado para produção)

Para vídeos grandes, considere usar um serviço de streaming:

**Cloudflare Stream**
```typescript
<VideoPlayer
  url="https://customer-xxxxx.cloudflarestream.com/VIDEO_ID/manifest/video.m3u8"
  ...
/>
```

**Vimeo Pro**
- Upload para Vimeo
- Obtenha link privado
- Use na landing page

**AWS S3 + CloudFront**
- Upload para S3
- Configure CloudFront
- Use URL do CloudFront

## Alterar o Timing do CTA

Para mudar quando o botão aparece, edite `src/pages/LandingPage.tsx`:

```typescript
// Linha 69
showControlsAfter={687} // 687 segundos = 11:27

// Linha 41
if (time >= 687 && !showContent) { // Mudar 687 para o tempo desejado
```

**Exemplos:**
- 5:00 = 300 segundos
- 10:00 = 600 segundos
- 11:27 = 687 segundos
- 15:00 = 900 segundos

## Otimização para Produção

### Problema: Vídeo muito grande (4.3 GB)

Este tamanho pode causar:
- ❌ Carregamento lento
- ❌ Alto uso de banda
- ❌ Custo elevado de hosting

### Soluções Recomendadas:

#### 1. Compressão do Vídeo

Use FFmpeg para comprimir sem perder muita qualidade:

```bash
ffmpeg -i marketing-video.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k marketing-video-compressed.mp4
```

Isso pode reduzir para ~500 MB mantendo boa qualidade.

#### 2. Múltiplas Resoluções

Gere versões em diferentes resoluções:

```bash
# 1080p
ffmpeg -i input.mp4 -vf scale=-2:1080 -c:v libx264 -crf 23 output-1080p.mp4

# 720p
ffmpeg -i input.mp4 -vf scale=-2:720 -c:v libx264 -crf 23 output-720p.mp4

# 480p
ffmpeg -i input.mp4 -vf scale=-2:480 -c:v libx264 -crf 23 output-480p.mp4
```

Use bibliotecas como `react-player` com adaptive streaming.

#### 3. Hospedar em CDN

Não hospede no servidor da aplicação! Use:

- **Bunny CDN**: ~$0.01/GB
- **Cloudflare Stream**: $1/1000 minutos
- **AWS CloudFront**: $0.085/GB
- **Vimeo Pro**: $75/ano (500 GB)

#### 4. Streaming Adaptativo (HLS/DASH)

Converta para HLS para carregamento progressivo:

```bash
ffmpeg -i input.mp4 \
  -codec: copy -start_number 0 -hls_time 10 -hls_list_size 0 \
  -f hls output.m3u8
```

## Configuração do .gitignore

Os vídeos estão no .gitignore para não versionar arquivos grandes:

```gitignore
# Large video files
public/videos/*.mp4
public/videos/*.mov
public/videos/*.avi
```

## Vídeo Original

O vídeo original está salvo em:
```
C:\ERP_SISTEMAS\Landepage ELI\referencia\Video.mp4
```

**Importante:** Mantenha sempre um backup do vídeo original!

## Análise de Performance

Para verificar o desempenho do vídeo:

1. Abra DevTools (F12)
2. Vá na aba Network
3. Recarregue a página
4. Veja o tamanho e tempo de carregamento do vídeo

**Tempos ideais:**
- Início do carregamento: < 2 segundos
- First byte: < 1 segundo
- Buffer mínimo: ~30 segundos de vídeo

## Dicas para Máxima Conversão

### 1. Otimize o Thumbnail
- Use uma imagem chamativa como poster do vídeo
- Mostre o benefício principal

### 2. Adicione Closed Captions
- Muitos assistem sem som
- Melhora acessibilidade

### 3. A/B Test do Timing
- Teste diferentes tempos para aparecer o CTA:
  - Grupo A: 5:00
  - Grupo B: 11:27
  - Grupo C: 15:00
- Veja qual converte mais

### 4. Adicione Marcadores
- Mostre progresso visual
- "Faltam 5 minutos para desbloquear a oferta"

## Troubleshooting

### Vídeo não carrega
1. Verifique se o arquivo existe em `public/videos/`
2. Confirme o nome do arquivo
3. Verifique o console (F12) para erros

### Vídeo lento
1. Comprima o vídeo
2. Use CDN
3. Considere Cloudflare Stream

### Botão não aparece
1. Verifique o console
2. Confirme que o vídeo chegou aos 11:27
3. Teste com um tempo menor (ex: 10 segundos)

### Controles aparecem antes do tempo
1. Verifique `showControlsAfter` no VideoPlayer
2. Confirme que não há CSS sobrescrevendo

## Métricas para Acompanhar

No dashboard, monitore:
- **Taxa de Abandono**: Quantos saem antes de 11:27
- **Tempo Médio de Visualização**: Está próximo de 11:27?
- **Conversão Vídeo→Lead**: Quantos que chegaram a 11:27 preencheram?

Se muitos abandonam antes de 11:27, considere:
- Reduzir o tempo
- Melhorar o conteúdo do vídeo
- Adicionar elementos visuais
