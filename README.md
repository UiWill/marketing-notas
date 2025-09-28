# Dnotas Landing Page

Landing page profissional para conversão de leads com sistema de tracking avançado.

## 🚀 Características

- **Landing Page Otimizada**: Design focado em conversão baseado na referência fornecida
- **Video Player Customizado**: Player com controles bloqueados e tracking detalhado
- **Captura de Leads**: Formulário otimizado com validação e integração Supabase
- **Dashboard Analytics**: Painel completo para acompanhar performance
- **Tracking Avançado**: Monitoramento de progresso de vídeo e eventos
- **Responsive Design**: Otimizado para desktop, tablet e mobile
- **SEO Otimizado**: Meta tags e estrutura para melhor indexação

## 🛠️ Tecnologias

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **Backend**: Supabase (Database + Auth)
- **Analytics**: Facebook Pixel + Google Analytics
- **Forms**: React Hook Form
- **Video**: React Player

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 🎯 Funcionalidades Principais

### Landing Page
- Headline otimizada para Facebook Ads
- Vídeo com player bloqueado inicialmente
- Botão CTA que aparece em timing específico
- Conteúdo que aparece após interação
- Design responsivo e otimizado para conversão

### Video Tracking
- Controle de reprodução personalizado
- Tracking de progresso em tempo real
- Detecção de pontos de abandono
- Eventos salvos no banco de dados
- Integração com analytics externos

### Sistema de Leads
- Formulário com validação robusta
- Captura de dados UTM automática
- Integração direta com Supabase
- Tracking de eventos de conversão
- Segmentação por faturamento

### Dashboard de Marketing
- Visão geral de performance
- Lista detalhada de leads
- Analytics de vídeo e conversão
- Segmentação por fonte e valor
- Dados em tempo real

## 🔧 Configuração

### Supabase Setup
O projeto já está configurado com as credenciais do Supabase. As tabelas necessárias são:

- `leads`: Dados dos leads capturados
- `video_events`: Eventos de interação com vídeo

### Analytics Setup
Configure os IDs nos seguintes locais:
- Facebook Pixel: `index.html` (YOUR_PIXEL_ID)
- Google Analytics: `index.html` (GA_MEASUREMENT_ID)

## 📱 Acesso

- **Landing Page**: `/`
- **Dashboard**: `/dashboard`

## 🎨 Customização

O design segue a paleta definida no Tailwind config:
- Primary: Tons de azul para elementos principais
- Accent: Laranja para CTAs e destaques
- Gradientes personalizados para botões

## 📊 Métricas Importantes

O sistema tracking automaticamente:
- Total de leads capturados
- Taxa de conversão
- Progresso médio do vídeo
- Pontos de abandono mais comuns
- Segmentação por valor e fonte

## 🚀 Deploy

Para deploy em produção:

1. Configure as variáveis de ambiente
2. Atualize os IDs de analytics
3. Substitua a URL do vídeo placeholder
4. Execute `npm run build`
5. Deploy a pasta `dist`

## 📈 Otimizações

- Lazy loading de componentes
- Compressão de imagens
- Minificação de CSS/JS
- Cache de assets
- SEO meta tags
- Performance monitoring