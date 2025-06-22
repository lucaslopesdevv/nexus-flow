#!/bin/bash

# Script para inicializar o ambiente de desenvolvimento

set -e

echo "🚀 Iniciando Nexus Flow - Ambiente de Desenvolvimento"

# Verificar se o arquivo .env existe
if [ ! -f .env ]; then
    echo "📄 Criando arquivo .env a partir do .env.example..."
    cp .env.example .env
    echo "⚠️  Por favor, configure suas variáveis de ambiente no arquivo .env"
fi

# Limpar containers existentes se necessário
echo "🧹 Limpando containers antigos..."
docker-compose down -v --remove-orphans

# Construir e iniciar os serviços
echo "🔨 Construindo e iniciando os serviços..."
NODE_ENV=development DOCKER_TARGET=development docker-compose up --build -d

# Aguardar o banco de dados ficar pronto
echo "⏳ Aguardando o banco de dados ficar pronto..."
sleep 10

# Executar migrações do Prisma
echo "📊 Executando migrações do banco de dados..."
docker-compose exec api npx prisma migrate deploy

echo "✅ Ambiente de desenvolvimento iniciado com sucesso!"
echo ""
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 API: http://localhost:3001"
echo "📊 Database: localhost:5432"
echo ""
echo "Para parar os serviços: docker-compose down"
echo "Para ver os logs: docker-compose logs -f" 