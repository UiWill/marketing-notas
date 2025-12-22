# Guia de Eventos do Facebook Pixel

## Pixel ID
**1279949890819385**

---

## ✅ Eventos Implementados

### Eventos Padrão do Facebook (Standard Events)

Estes eventos são reconhecidos automaticamente pelo Facebook e usados para otimização de anúncios:

#### 1. **PageView**
- **Quando:** Cada vez que a landing page é carregada
- **Uso:** Tracking básico de visitantes, criação de públicos

#### 2. **Lead**
- **Quando:** Formulário é enviado com sucesso
- **Parâmetros:** `{ value: 525, currency: 'BRL' }`
- **Uso:** Otimização de campanhas para captação de leads

#### 3. **CompleteRegistration**
- **Quando:** Lead completa o cadastro
- **Uso:** Otimização para conversões de registro

#### 4. **InitiateCheckout**
- **Quando:** Usuário clica no botão "CONTRATAR SERVIÇO AGORA" no pricing
- **Parâmetros:** `{ value: 525, currency: 'BRL' }`
- **Uso:** Tracking de intenção de compra

---

### Eventos Customizados (Custom Events)

Eventos específicos para análise detalhada do comportamento do usuário:

#### **Vídeo**

##### VideoStart
- **Quando:** Usuário inicia o vídeo
- **Parâmetros:** `{ video_title: 'Marketing Video' }`
- **Insight:** Quantos visitantes engajam com o vídeo

##### VideoProgress
- **Quando:** Usuário atinge marcos de 25%, 50%, 75%, 95%
- **Parâmetros:** `{ video_title, percentage, current_time, duration }`
- **Insight:** Retenção do vídeo por estágio

##### VideoComplete
- **Quando:** Usuário completa o vídeo (95%+)
- **Parâmetros:** `{ video_title, duration }`
- **Insight:** Taxa de conclusão do vídeo

##### VideoDropoff
- **Quando:** Usuário sai da página sem completar o vídeo
- **Parâmetros:** `{ video_title, dropped_at, percentage }`
- **Insight:** Pontos críticos onde perdem interesse

---

#### **Seções da Página**

##### SectionView
- **Quando:** Usuário visualiza uma seção (30% visível por 1s+)
- **Seções Rastreadas:** hero, video, testimonials, benefits, comparison, pricing, guarantee
- **Parâmetros:** `{ section, time_spent }`
- **Insight:** Quais seções geram mais engajamento

---

#### **CTAs e Botões**

##### CTAClick
- **Quando:** Qualquer CTA principal é clicado
- **Localizações:**
  - `below_video` - CTA abaixo do vídeo
  - `main_cta` - CTA principal da página
  - `pricing_card` - CTA no card de preço
- **Parâmetros:** `{ cta_location, cta_text, target }`
- **Insight:** Qual CTA gera mais conversões

##### ButtonClick
- **Quando:** Botões secundários são clicados
- **Exemplos:** WhatsApp, Links externos
- **Parâmetros:** `{ button_name, button_location }`
- **Insight:** Engajamento com canais alternativos

---

#### **Formulário**

##### FormStart
- **Quando:** Usuário foca no primeiro campo do formulário
- **Insight:** Taxa de início de preenchimento

##### FormSubmit
- **Quando:** Formulário é enviado com sucesso
- **Parâmetros:** `{ form_name: 'lead_capture', revenue }`
- **Insight:** Taxa de conversão do formulário

---

#### **Engajamento**

##### ScrollDepth
- **Quando:** Usuário atinge marcos de scroll (25%, 50%, 75%, 100%)
- **Parâmetros:** `{ depth }`
- **Insight:** Engajamento com o conteúdo da página

##### ActionSequence
- **Quando:** Cada ação do usuário
- **Parâmetros:** `{ action_name, sequence_number, previous_action, time_since_previous }`
- **Insight:** Jornada do usuário até conversão

##### TimeOnPage
- **Quando:** Usuário sai da página
- **Parâmetros:** `{ seconds }`
- **Insight:** Tempo médio de engajamento

##### Conversion
- **Quando:** Lead é capturado com sucesso
- **Parâmetros:** `{ conversion_type, value, currency, video_completed, sections_viewed, time_on_page }`
- **Insight:** Análise completa do funil de conversão

---

## 📊 Como Usar no Facebook Ads Manager

### 1. Criar Públicos Personalizados

**Públicos de Alta Intenção:**
```
- VideoProgress (percentage >= 75) AND TimeOnPage (seconds >= 180)
- SectionView (section = 'pricing') AND CTAClick
- FormStart AND NOT FormSubmit (abandonaram formulário)
```

**Públicos de Remarketing:**
```
- PageView AND NOT Lead (visitaram mas não converteram)
- VideoDropoff (dropped_at > 120) (assistiram 2min+ mas saíram)
- SectionView (section = 'testimonials') (engajaram com depoimentos)
```

---

### 2. Otimização de Campanhas

#### Campanhas de Topo de Funil
**Objetivo:** Lead
**Evento de Otimização:** Lead
**Público:** Lookalike de VideoComplete + SectionView(testimonials)

#### Campanhas de Meio de Funil
**Objetivo:** Lead
**Evento de Otimização:** InitiateCheckout
**Público:** Remarketing de PageView (últimos 7 dias)

#### Campanhas de Fundo de Funil
**Objetivo:** Lead
**Evento de Otimização:** CompleteRegistration
**Público:** FormStart sem FormSubmit (últimas 24h)

---

### 3. Análise de Eventos no Events Manager

Acesse: Facebook Business > Events Manager > Seu Pixel

**Métricas Principais a Acompanhar:**

1. **Taxa de Conversão por Evento:**
   - PageView → VideoStart → VideoProgress(50%) → CTAClick → FormStart → Lead

2. **Drop-off Points:**
   - VideoDropoff por timestamp
   - Abandonos em SectionView

3. **Tempo até Conversão:**
   - ActionSequence com time_since_previous
   - TimeOnPage dos leads convertidos vs não convertidos

---

## 🎯 Insights para Otimização

### Análise de Vídeo

**Se VideoProgress(25%) < 50% dos VideoStart:**
→ Hook inicial fraco, melhorar primeiros 30 segundos

**Se VideoProgress(50%) < VideoProgress(25%) * 0.7:**
→ Perda de interesse no meio, revisar conteúdo 1-2min

**Se VideoComplete < VideoProgress(75%) * 0.5:**
→ Final fraco, fortalecer call-to-action

---

### Análise de Seções

**Se SectionView(testimonials) tem alta conversão:**
→ Mover depoimentos para cima na página
→ Destacar mais nos anúncios

**Se SectionView(pricing) tem baixa taxa:**
→ CTAs não estão levando para preço
→ Melhorar scroll ou adicionar âncoras

---

### Análise de CTAs

**Se CTAClick alta mas FormSubmit baixa:**
→ Formulário muito longo ou complexo
→ Simplificar campos

**Se InitiateCheckout alto mas Lead baixo:**
→ Fricção no formulário
→ Testar remover campos ou melhorar copy

---

### Análise de Público

**Criar Lookalike de:**
1. Lead (óbvio, mas funciona)
2. VideoComplete + TimeOnPage(>180s)
3. SectionView(testimonials) + SectionView(pricing)
4. ActionSequence com múltiplas ações

**Excluir:**
1. FormStart sem FormSubmit (leads frustrados)
2. VideoDropoff(<30s) (não se interessaram)

---

## 🔧 Testes A/B Recomendados

### Teste 1: Posição do CTA
**Variante A:** CTA após vídeo
**Variante B:** CTA durante vídeo (popup)
**Métrica:** CTAClick → FormSubmit

### Teste 2: Ordem de Seções
**Variante A:** Vídeo → Benefícios → Depoimentos → Preço
**Variante B:** Vídeo → Depoimentos → Benefícios → Preço
**Métrica:** SectionView(pricing) + Lead

### Teste 3: Formulário
**Variante A:** 3 campos (Nome, Email, Telefone)
**Variante B:** 2 campos (Nome, WhatsApp)
**Métrica:** FormStart → FormSubmit

---

## 📈 Dashboard Recomendado no Facebook

### Colunas Personalizadas

1. **Taxa de Início de Vídeo:**
   `VideoStart / PageView * 100`

2. **Taxa de Conclusão de Vídeo:**
   `VideoComplete / VideoStart * 100`

3. **Taxa de Conversão do Formulário:**
   `FormSubmit / FormStart * 100`

4. **Custo por Vídeo Completo:**
   `Gasto / VideoComplete`

5. **Taxa de Engajamento Alto:**
   `(VideoProgress(75%) + SectionView(testimonials)) / PageView`

---

## 🎬 Eventos em Ação - Exemplo de Jornada

### Jornada de Sucesso Típica:

```
1. PageView
   ↓ 0s
2. VideoStart
   ↓ 30s
3. ScrollDepth (25%)
   ↓ 45s
4. VideoProgress (25%)
   ↓ 90s
5. VideoProgress (50%)
   ↓ 120s
6. SectionView (testimonials)
   ↓ 150s
7. VideoProgress (75%)
   ↓ 180s
8. ScrollDepth (75%)
   ↓ 200s
9. SectionView (pricing)
   ↓ 220s
10. CTAClick (pricing_card)
    ↓ 5s
11. InitiateCheckout
    ↓ 10s
12. FormStart
    ↓ 45s
13. FormSubmit
    ↓ 0s
14. Lead
    ↓ 0s
15. CompleteRegistration
    ↓ 0s
16. Conversion
```

**Total Time:** ~5 minutos
**Eventos Disparados:** 16

---

## ✅ Checklist de Verificação

### No Facebook Events Manager

- [ ] Pixel está ativo e recebendo eventos
- [ ] PageView está sendo registrado
- [ ] Lead está sendo registrado com valor (R$ 525)
- [ ] InitiateCheckout está sendo registrado
- [ ] Eventos customizados aparecem na lista

### No Facebook Ads Manager

- [ ] Criar público de PageView (últimos 180 dias)
- [ ] Criar público de VideoComplete
- [ ] Criar público de Lead (para exclusão)
- [ ] Configurar campanha otimizada para Lead
- [ ] Criar coluna personalizada de custo por vídeo completo

### Testes

- [ ] Visitar a página e verificar eventos no console
- [ ] Assistir vídeo e verificar marcos de 25%, 50%, 75%
- [ ] Rolar página e verificar scroll depth
- [ ] Clicar CTAs e verificar tracking
- [ ] Preencher formulário e verificar Lead

---

## 🚀 Próximos Passos

1. **Semana 1-2:** Coletar dados iniciais sem fazer alterações
2. **Semana 3:** Analisar eventos e identificar gargalos
3. **Semana 4:** Implementar primeiro teste A/B
4. **Semana 5+:** Iterar baseado em dados

---

**🎉 Seu Facebook Pixel está 100% configurado e pronto para otimizar seus anúncios!**

Todos os eventos estão sendo rastreados e você tem visibilidade completa da jornada do usuário.
