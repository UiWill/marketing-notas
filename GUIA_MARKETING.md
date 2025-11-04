# 📊 Guia Completo do Dashboard de Marketing - Dnotas

**Versão 1.0** | Atualizado em Novembro 2024

---

## 📋 Índice

1. [Como Acessar o Dashboard](#como-acessar-o-dashboard)
2. [Visão Geral das Métricas](#visão-geral-das-métricas)
3. [Entendendo Cada Métrica](#entendendo-cada-métrica)
4. [Funil de Conversão](#funil-de-conversão)
5. [Análise de Fontes de Tráfego](#análise-de-fontes-de-tráfego)
6. [Como Usar os Dados para Otimizar Campanhas](#como-usar-os-dados-para-otimizar-campanhas)
7. [Perguntas Frequentes](#perguntas-frequentes)
8. [Glossário de Termos](#glossário-de-termos)

---

## 🔐 Como Acessar o Dashboard

### URL de Acesso

```
https://seu-dominio.com/dashboard
```

**Exemplo:**
- Se o site está em `dnotas.com.br`, acesse: `dnotas.com.br/dashboard`
- Em desenvolvimento: `http://localhost:5173/dashboard`

### Primeiro Acesso

1. Abra o navegador (Chrome, Firefox, Safari ou Edge)
2. Digite a URL do dashboard
3. O dashboard carrega automaticamente - não precisa de login (por enquanto)

**⚠️ IMPORTANTE**: Mantenha a URL do dashboard privada! Compartilhe apenas com a equipe de marketing.

---

## 📊 Visão Geral das Métricas

O dashboard está dividido em **4 seções principais**:

### 1️⃣ Métricas de Tráfego (Cards Coloridos - Linha Superior)

```
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│  VISITANTES     │  TAXA DE VÍDEO  │  TAXA DE CTA   │  TAXA DE FORM  │
│   ÚNICOS (🔵)   │  INICIADO (🟣)  │  CLICADO (🟠)  │  COMPLETO (🟢) │
│                 │                 │                 │                 │
│      150        │     75.5%       │     45.2%      │     12.3%      │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

### 2️⃣ Métricas de Leads (Cards Brancos - Segunda Linha)

```
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│  TOTAL DE       │  TAXA DE        │  CONCLUSÃO      │  POTENCIAL DE  │
│   LEADS         │  CONVERSÃO      │  MÉDIA VÍDEO    │   RECEITA      │
│                 │                 │                 │                 │
│      23         │     8.7%        │     68.3%       │  R$ 575.000    │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

### 3️⃣ Funil de Conversão (Gráfico de Barras)

```
Visitantes Únicos        ████████████████████  150 (100%)
Iniciaram Vídeo          ███████████████       113 (75.3%)
Clicaram CTA             ██████████            68  (45.3%)
Preencheram Formulário   ████                  23  (15.3%)
Converteram              ██                    8   (5.3%)
```

### 4️⃣ Tabelas de Análise

- **Fontes de Tráfego**: De onde vêm os visitantes
- **Leads por Fonte**: Conversões por origem
- **Segmentos de Faturamento**: Perfil dos leads
- **Leads Recentes**: Lista detalhada com contatos

---

## 📈 Entendendo Cada Métrica

### 🔵 Visitantes Únicos

**O que é**: Número de pessoas diferentes que acessaram a landing page.

**Como é calculado**:
- Cada navegador/dispositivo = 1 visitante único
- Se a mesma pessoa acessar 5 vezes do mesmo navegador = conta como 1
- Se acessar do celular e do computador = conta como 2

**O que esse número significa**:
- ✅ **Alto**: Sua campanha está gerando tráfego!
- ⚠️ **Baixo**: Precisa investir mais em divulgação

**Meta recomendada**: Depende do investimento em anúncios
- Google Ads: ~100-500 visitantes/dia
- Facebook Ads: ~200-1000 visitantes/dia
- Tráfego orgânico: ~10-100 visitantes/dia

---

### 🟣 Taxa de Visualização do Vídeo

**O que é**: Porcentagem de visitantes que deram PLAY no vídeo.

**Fórmula**: `(Pessoas que iniciaram o vídeo / Visitantes Únicos) × 100`

**Exemplo**:
- 150 visitantes únicos
- 113 iniciaram o vídeo
- Taxa = (113 / 150) × 100 = **75.3%**

**O que esse número significa**:
- ✅ **Acima de 60%**: Excelente! O título/copy está atraindo
- ⚠️ **40-60%**: Bom, mas pode melhorar
- ❌ **Abaixo de 40%**: Algo está errado - veja "Como Otimizar"

**Como melhorar**:
- Melhore o headline da página
- Use uma thumbnail mais atrativa
- Adicione um texto antes do vídeo criando curiosidade
- Reduza distrações na página

---

### 🟠 Taxa de Clique no CTA

**O que é**: Porcentagem de visitantes que clicaram no botão de Call-to-Action (formulário).

**Importante**: O CTA só aparece aos **11:27** do vídeo!

**Fórmula**: `(Pessoas que clicaram no CTA / Visitantes Únicos) × 100`

**O que esse número significa**:
- ✅ **Acima de 30%**: Muito bom! O vídeo está engajando
- ⚠️ **15-30%**: Razoável
- ❌ **Abaixo de 15%**: As pessoas estão abandonando o vídeo cedo

**Como melhorar**:
- Verifique a taxa de abandono (quantos saem antes de 11:27)
- Considere reduzir o tempo de aparecer o CTA
- Melhore o conteúdo do vídeo nos primeiros minutos
- Adicione elementos visuais para prender atenção

---

### 🟢 Taxa de Conversão de Formulário

**O que é**: Porcentagem de visitantes que completaram o cadastro.

**Fórmula**: `(Formulários preenchidos / Visitantes Únicos) × 100`

**O que esse número significa**:
- ✅ **Acima de 10%**: Excelente conversão!
- ⚠️ **5-10%**: Bom, dentro da média
- ❌ **Abaixo de 5%**: Precisa otimizar

**Como melhorar**:
- Simplifique o formulário (menos campos)
- Melhore a oferta no vídeo
- Adicione senso de urgência
- Teste diferentes CTAs

---

### 👥 Total de Leads

**O que é**: Número total de pessoas que se cadastraram.

**O que fazer com esse número**:
- Compare com a meta mensal
- Calcule o custo por lead (investimento / leads)
- Acompanhe o crescimento semana a semana

**Benchmark da indústria**:
- Serviços B2B: 20-50 leads/mês é um bom começo
- Com R$ 5.000 em anúncios: espere 30-100 leads

---

### 🎯 Taxa de Conversão (Leads → Clientes)

**O que é**: Porcentagem de leads que viraram clientes pagantes.

**Fórmula**: `(Convertidos / Total de Leads) × 100`

**O que esse número significa**:
- ✅ **Acima de 20%**: Excelente! Leads muito qualificados
- ⚠️ **10-20%**: Bom
- ❌ **Abaixo de 10%**: Leads podem não estar qualificados

**Como melhorar**:
- Filtre melhor no formulário (ex: faturamento mínimo)
- Melhore o follow-up de vendas
- Qualifique leads antes de passar para vendas

---

### 📹 Conclusão Média do Vídeo

**O que é**: Em média, quanto % do vídeo as pessoas assistem.

**Exemplo**:
- Vídeo tem 11:27 (687 segundos)
- Média de conclusão: 68.3%
- Isso significa que assistem em média até: 7:48

**O que esse número significa**:
- ✅ **Acima de 70%**: Vídeo muito engajante!
- ⚠️ **50-70%**: Razoável
- ❌ **Abaixo de 50%**: Vídeo pode estar chato/longo

**Pontos de atenção**:
- Se a média é < 68% (11:27 / 16:47), muitos estão saindo antes do CTA aparecer
- Isso impacta diretamente a conversão

---

### 💰 Potencial de Receita

**O que é**: Soma do faturamento mensal de todos os leads.

**Exemplo**:
- Lead 1: R$ 25.000/mês
- Lead 2: R$ 15.000/mês
- Lead 3: R$ 35.000/mês
- **Potencial Total**: R$ 75.000/mês

**Como usar**:
- Priorize leads com maior faturamento
- Calcule o ticket médio: Potencial Total / Total de Leads
- Use para prever receita do pipeline

---

## 🔄 Funil de Conversão

O funil mostra **onde você está perdendo pessoas**:

### Como Ler o Funil

```
Etapa 1: Visitantes Únicos (100%)
   ↓ [ABANDONO: 25%]
Etapa 2: Iniciaram Vídeo (75%)
   ↓ [ABANDONO: 30%]
Etapa 3: Clicaram CTA (45%)
   ↓ [ABANDONO: 33%]
Etapa 4: Preencheram Formulário (12%)
   ↓ [ABANDONO: 58%]
Etapa 5: Converteram (5%)
```

### Principais Pontos de Abandono

#### 1. Visitantes → Vídeo (25% abandonam)
**Problema**: Não dão play no vídeo
**Soluções**:
- Melhore o headline
- Adicione thumbnail atrativa
- Adicione texto de curiosidade

#### 2. Vídeo → CTA (30% abandonam)
**Problema**: Saem antes de 11:27
**Soluções**:
- Reduza o tempo do CTA (teste 5:00 ou 8:00)
- Melhore o conteúdo do vídeo
- Adicione contador "Faltam X minutos para oferta especial"

#### 3. CTA → Formulário (33% abandonam)
**Problema**: Clicam mas não preenchem
**Soluções**:
- Simplifique o formulário
- Remova campos opcionais
- Melhore a copy do botão

#### 4. Formulário → Cliente (58% abandonam)
**Problema**: Leads não convertem em vendas
**Soluções**:
- Melhore o follow-up
- Ligue em até 5 minutos após cadastro
- Qualifique melhor os leads

---

## 📍 Análise de Fontes de Tráfego

Esta seção mostra **de onde vêm seus visitantes**.

### Como Ler a Tabela

```
┌──────────────┬─────────┬──────────┬────────────────┬──────────┬────────────┐
│ Fonte        │ Meio    │ Campanha │ Sessões        │ Pageviews│ Conversões │
├──────────────┼─────────┼──────────┼────────────────┼──────────┼────────────┤
│ facebook     │ cpc     │ lancamento│ 120            │ 156      │ 15         │
│ google       │ cpc     │ search    │ 85             │ 92       │ 12         │
│ instagram    │ stories │ promocao  │ 45             │ 51       │ 3          │
│ direct       │ none    │ none      │ 30             │ 30       │ 2          │
└──────────────┴─────────┴──────────┴────────────────┴──────────┴────────────┘
```

### Entendendo os Termos

- **Fonte**: De onde vem (facebook, google, instagram, direct)
- **Meio**: Tipo de tráfego (cpc = pago, organic = orgânico)
- **Campanha**: Nome da campanha que você criou
- **Sessões**: Quantas visitas
- **Pageviews**: Quantas páginas foram vistas
- **Conversões**: Quantos se cadastraram

### Como Usar Parâmetros UTM

Para rastrear suas campanhas corretamente, use UTMs na URL:

**Estrutura**:
```
https://dnotas.com.br/?utm_source=FONTE&utm_medium=MEIO&utm_campaign=CAMPANHA
```

**Exemplos Práticos**:

1. **Anúncio no Facebook**:
```
https://dnotas.com.br/?utm_source=facebook&utm_medium=cpc&utm_campaign=lancamento_novembro
```

2. **Anúncio no Google**:
```
https://dnotas.com.br/?utm_source=google&utm_medium=cpc&utm_campaign=pesquisa_nfe
```

3. **Stories do Instagram**:
```
https://dnotas.com.br/?utm_source=instagram&utm_medium=stories&utm_campaign=promocao_black
```

4. **Email Marketing**:
```
https://dnotas.com.br/?utm_source=email&utm_medium=newsletter&utm_campaign=base_clientes
```

### Calculando ROI por Fonte

**Exemplo**:

Campanha Facebook:
- Investimento: R$ 2.000
- Sessões: 120
- Conversões: 15
- Taxa de conversão: 12.5%
- Custo por Lead: R$ 2.000 / 15 = **R$ 133,33**
- Potencial de receita: 15 × R$ 25.000 = R$ 375.000

**ROI**: Se converter 20% dos leads em clientes pagando R$ 125/mês:
- 3 clientes × R$ 125 × 12 meses = R$ 4.500/ano
- ROI = (R$ 4.500 - R$ 2.000) / R$ 2.000 = **125%**

---

## 🎯 Como Usar os Dados para Otimizar Campanhas

### Cenário 1: Muitos Visitantes, Poucos Leads

**Sintomas**:
- ✅ Visitantes Únicos: Alto (500+)
- ❌ Taxa de Formulário: Baixa (< 5%)

**Diagnóstico**: Tráfego não qualificado ou página não converte

**Soluções**:
1. Revise o targeting dos anúncios (público-alvo errado?)
2. Melhore o copy da página
3. Teste outro vídeo
4. Simplifique o formulário

---

### Cenário 2: Poucos Visitantes, Boa Conversão

**Sintomas**:
- ❌ Visitantes Únicos: Baixo (< 100)
- ✅ Taxa de Formulário: Alta (> 15%)

**Diagnóstico**: Público qualificado, mas falta tráfego

**Soluções**:
1. Aumente o budget dos anúncios
2. Expanda para novos canais
3. Teste remarketing
4. Invista em SEO

---

### Cenário 3: Alto Abandono no Vídeo

**Sintomas**:
- ✅ Taxa de Vídeo Iniciado: Alta (> 70%)
- ❌ Taxa de CTA Clicado: Baixa (< 20%)
- Conclusão Média: < 50%

**Diagnóstico**: Vídeo muito longo ou entediante

**Soluções**:
1. **URGENTE**: Reduza o tempo do CTA de 11:27 para 5:00
2. Grave um vídeo mais curto e direto
3. Adicione elementos visuais no vídeo
4. Teste A/B: vídeo curto vs. longo

---

### Cenário 4: Clicam Mas Não Preenchem

**Sintomas**:
- ✅ Taxa de CTA: Alta (> 40%)
- ❌ Taxa de Formulário: Baixa (< 10%)

**Diagnóstico**: Formulário complexo ou oferta não clara

**Soluções**:
1. Remova campos do formulário (deixe só: nome, email, telefone)
2. Faça o campo de faturamento opcional
3. Melhore a copy do botão (ex: "QUERO TESTAR GRÁTIS")
4. Adicione prova social antes do formulário

---

## 📊 Relatório Semanal Sugerido

### O Que Acompanhar Toda Segunda-Feira

```markdown
## Relatório Semanal - [Data]

### Métricas Gerais
- Visitantes Únicos: XXX (↑/↓ X% vs semana anterior)
- Total de Leads: XX (↑/↓ X%)
- Taxa de Conversão: X.X%
- Custo por Lead: R$ XXX

### Funil de Conversão
- Vídeo Iniciado: XX%
- CTA Clicado: XX%
- Formulário Completo: XX%

### Top 3 Fontes
1. [Fonte]: XX leads - R$ XX custo/lead
2. [Fonte]: XX leads - R$ XX custo/lead
3. [Fonte]: XX leads - R$ XX custo/lead

### Ações da Semana
- [ ] Otimizar campanha com maior custo/lead
- [ ] Aumentar budget da campanha com melhor ROI
- [ ] Testar novo criativo/copy
```

---

## ❓ Perguntas Frequentes

### 1. Por que o número de visitantes é diferente do Google Analytics?

**Resposta**: Podem haver pequenas diferenças porque:
- Bloqueadores de anúncios podem bloquear o Google Analytics
- Nosso sistema rastreia de forma diferente
- Diferença de fuso horário

**Qual usar**: Confie nos nossos números para funil de conversão, use GA para tráfego geral.

---

### 2. Como sei se minha taxa de conversão é boa?

**Resposta**: Benchmarks da indústria (B2B):
- Landing page padrão: 2-5%
- Landing page com vídeo: 5-10%
- Webinar/vídeo longo: 10-25%

Se você está acima de **8%**, está indo muito bem!

---

### 3. Quanto devo investir em anúncios?

**Resposta**: Depende do seu objetivo:
- **Teste inicial**: R$ 1.000-2.000/mês
- **Escala inicial**: R$ 5.000-10.000/mês
- **Crescimento**: R$ 20.000+/mês

**Regra de ouro**: Custo por Lead deve ser **< 10% do ticket médio mensal**

Exemplo:
- Ticket médio: R$ 125/mês
- Custo por lead máximo: R$ 12,50
- Se está pagando R$ 50/lead = muito caro, otimize!

---

### 4. Com que frequência devo checar o dashboard?

**Recomendado**:
- **Diariamente**: Dê uma olhada rápida (5 min)
- **Semanalmente**: Análise profunda (30 min)
- **Mensalmente**: Relatório completo e ajustes estratégicos (2h)

---

### 5. Posso exportar os dados?

**Atualmente**: Não há botão de export, mas você pode:
1. Fazer screenshots
2. Copiar dados manualmente
3. Pedir ao suporte técnico para exportar do banco de dados

**Próxima versão**: Teremos export para Excel/CSV!

---

### 6. Como entro em contato com os leads?

**Resposta**: Na tabela "Leads Recentes" você tem:
- ✅ Nome completo
- ✅ Email
- ✅ Telefone
- ✅ Faturamento mensal

Clique em "Ver Detalhes" para mais informações.

**Dica**: Configure um CRM (HubSpot, RD Station, Pipedrive) para integrar automaticamente!

---

## 📚 Glossário de Termos

### A

**A/B Test (Teste A/B)**: Testar duas versões diferentes para ver qual performa melhor
**Analytics**: Análise de dados e métricas

### C

**CTA (Call-to-Action)**: Chamada para ação (ex: botão "Cadastre-se")
**Conversão**: Quando um visitante completa uma ação desejada (cadastro, compra, etc.)
**CTR (Click-Through Rate)**: Taxa de cliques

### F

**Funil de Conversão**: Caminho que o visitante percorre até virar cliente
**Follow-up**: Acompanhamento pós-cadastro

### L

**Landing Page**: Página de destino dos anúncios
**Lead**: Pessoa que demonstrou interesse (se cadastrou)
**Lead Qualificado**: Lead que tem perfil ideal de cliente

### P

**Pixel**: Código de rastreamento (Facebook Pixel, Google Analytics)
**Pipeline**: Conjunto de leads em processo de vendas

### R

**ROI (Return on Investment)**: Retorno sobre investimento
**Remarketing**: Mostrar anúncios para quem já visitou o site

### S

**SEO**: Otimização para motores de busca (Google)
**Session (Sessão)**: Visita ao site

### T

**Taxa de Conversão**: Percentual que converte
**Ticket Médio**: Valor médio que cada cliente paga

### U

**UTM Parameters**: Códigos na URL para rastrear origem do tráfego
**Unique Visitor (Visitante Único)**: Pessoa única que visitou

---

## 🆘 Suporte e Ajuda

### Precisa de Ajuda?

**Suporte Técnico**:
- Email: [seu-email@empresa.com]
- WhatsApp: [seu-telefone]

**Treinamento**:
- Agende uma call de 30 minutos para tirar dúvidas
- Disponibilizamos vídeo-tutorial

**Solicitações**:
- Export de dados
- Relatórios customizados
- Integrações com CRM

---

## 🎯 Checklist: Primeira Campanha

- [ ] URLs com UTM configuradas
- [ ] Anúncios criados e aprovados
- [ ] Budget definido
- [ ] Meta de leads estabelecida
- [ ] Dashboard acessível
- [ ] Follow-up preparado
- [ ] CRM configurado (opcional)

---

**🚀 Boas vendas! Use os dados a seu favor!**

---

*Última atualização: Novembro 2024 | Versão 1.0*
*Criado para a equipe de Marketing da Dnotas*
