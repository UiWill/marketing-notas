-- Comando simples para ver todas as tabelas
SELECT * FROM pg_tables WHERE schemaname = 'public';

-- OU este comando ainda mais direto:
\dt

-- Para ver a estrutura da tabela leads (se existir):
\d leads

-- Para ver todas as colunas da tabela leads:
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'leads';
