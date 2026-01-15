-- Tabela de Cupons de Desconto
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10, 2) NOT NULL,
  active BOOLEAN DEFAULT true,
  valid_until TIMESTAMP WITH TIME ZONE,
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Adicionar colunas na tabela leads para tracking de cupons e múltiplas empresas
ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS coupon_code VARCHAR(50),
ADD COLUMN IF NOT EXISTS companies_count INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS additional_cnpjs TEXT[],
ADD COLUMN IF NOT EXISTS final_value DECIMAL(10, 2);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON public.coupons(active);
CREATE INDEX IF NOT EXISTS idx_leads_coupon ON public.leads(coupon_code);

-- Comentários nas colunas
COMMENT ON COLUMN public.coupons.discount_type IS 'Tipo de desconto: percentage (porcentagem) ou fixed (valor fixo)';
COMMENT ON COLUMN public.coupons.discount_value IS 'Valor do desconto (porcentagem ou valor fixo em reais)';
COMMENT ON COLUMN public.coupons.max_uses IS 'Número máximo de usos do cupom (NULL = ilimitado)';
COMMENT ON COLUMN public.coupons.used_count IS 'Contador de quantas vezes o cupom foi usado';
COMMENT ON COLUMN public.leads.companies_count IS 'Quantidade de empresas do cliente';
COMMENT ON COLUMN public.leads.additional_cnpjs IS 'Array com CNPJs adicionais das outras empresas';
COMMENT ON COLUMN public.leads.final_value IS 'Valor final pago após descontos';

-- Inserir cupons de exemplo
INSERT INTO public.coupons (code, description, discount_type, discount_value, active, max_uses)
VALUES
  ('BEMVINDO10', 'Cupom de boas-vindas - 10% de desconto', 'percentage', 10.00, true, 100),
  ('PRIMEIRACOMPRA', 'Primeira compra - R$ 50 de desconto', 'fixed', 50.00, true, NULL),
  ('INDICACAO20', 'Indicação de cliente - 20% de desconto', 'percentage', 20.00, true, 50)
ON CONFLICT (code) DO NOTHING;
