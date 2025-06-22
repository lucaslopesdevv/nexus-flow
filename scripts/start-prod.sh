#!/bin/bash

# Script para inicializar o ambiente de produção

set -e

echo "🚀 Iniciando Nexus Flow - Ambiente de Produção"

# Verificar se o arquivo .env.production existe
if [ ! -f .env.production ]; then
    echo "❌ Arquivo .env.production não encontrado!"
    echo "Por favor, crie o arquivo .env.production com as configurações de produção."
    exit 1
fi

# Carregar variáveis de ambiente de produção
export $(cat .env.production | xargs)

# Verificar variáveis obrigatórias
if [ -z "$CLERK_SECRET_KEY" ] || [ -z "$VITE_CLERK_PUBLISHABLE_KEY" ]; then
    echo "❌ Variáveis de ambiente obrigatórias não configuradas!"
    echo "Certifique-se de que CLERK_SECRET_KEY e VITE_CLERK_PUBLISHABLE_KEY estão definidas."
    exit 1
fi

# Limpar containers existentes se necessário
echo "🧹 Limpando containers antigos..."
docker-compose -f docker-compose.prod.yml down -v --remove-orphans

# Construir e iniciar os serviços
echo "🔨 Construindo e iniciando os serviços..."
docker-compose -f docker-compose.prod.yml up --build -d

# Aguardar o banco de dados ficar pronto
echo "⏳ Aguardando o banco de dados ficar pronto..."
sleep 15

# Executar migrações do Prisma
echo "📊 Executando migrações do banco de dados..."
docker-compose -f docker-compose.prod.yml exec api npx prisma migrate deploy

echo "✅ Ambiente de produção iniciado com sucesso!"
echo ""
echo "🌐 Aplicação: http://localhost"
echo "🔧 API: http://localhost:3001"
echo ""
echo "Para parar os serviços: docker-compose -f docker-compose.prod.yml down"
echo "Para ver os logs: docker-compose -f docker-compose.prod.yml logs -f" 