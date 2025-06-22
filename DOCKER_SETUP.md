# 🐳 Guia de Configuração Docker - Nexus Flow

Este guia explica como configurar e executar o Nexus Flow usando Docker para desenvolvimento e produção.

## 📋 Pré-requisitos

- Docker Desktop instalado
- Docker Compose v2+

## 🚀 Configuração Inicial

### 1. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```bash
# Environment
NODE_ENV=development
DOCKER_TARGET=development

# Database
DATABASE_URL=postgresql://postgres:postgres@db:5432/nexus_flow
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=nexus_flow

# API Configuration
PORT=3001
HOST=0.0.0.0
CORS_ORIGINS=http://localhost:5173
LOG_LEVEL=debug
ENABLE_SWAGGER=true
RATE_LIMIT=100

# Authentication (Clerk)
CLERK_SECRET_KEY=your_clerk_secret_key_here
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here

# Frontend Configuration
VITE_API_URL=http://localhost:3001
VITE_APP_ENV=development
```

### 2. Configurar Clerk Authentication

1. Acesse [Clerk Dashboard](https://dashboard.clerk.com)
2. Crie uma nova aplicação
3. Copie as chaves e substitua no arquivo `.env`:
   - `CLERK_SECRET_KEY` (chave secreta do backend)
   - `VITE_CLERK_PUBLISHABLE_KEY` (chave pública do frontend)

## 🛠️ Comandos Disponíveis

### Desenvolvimento

```bash
# Iniciar ambiente de desenvolvimento
make dev
# ou
./scripts/start-dev.sh

# Ver logs
make logs

# Parar serviços
make stop
```

### Produção

1. Crie um arquivo `.env.production` com configurações de produção:

```bash
# Environment
NODE_ENV=production

# Database (use uma senha forte em produção)
DATABASE_URL=postgresql://postgres:SENHA_FORTE@db:5432/nexus_flow
POSTGRES_USER=postgres
POSTGRES_PASSWORD=SENHA_FORTE
POSTGRES_DB=nexus_flow

# API Configuration
PORT=3001
HOST=0.0.0.0
CORS_ORIGINS=https://seudominio.com
LOG_LEVEL=info
ENABLE_SWAGGER=false
RATE_LIMIT=100

# Authentication (Clerk - configurações de produção)
CLERK_SECRET_KEY=seu_clerk_secret_key_producao
VITE_CLERK_PUBLISHABLE_KEY=seu_clerk_publishable_key_producao

# Frontend Configuration
VITE_API_URL=https://api.seudominio.com
VITE_APP_ENV=production
```

2. Iniciar em produção:

```bash
# Iniciar ambiente de produção
make prod
# ou
./scripts/start-prod.sh

# Ver logs de produção
make logs-prod
```

## 📡 Endpoints e Portas

### Desenvolvimento
- **Frontend**: http://localhost:5173
- **API**: http://localhost:3001
- **Database**: localhost:5432
- **Swagger UI**: http://localhost:3001/documentation

### Produção
- **Frontend**: http://localhost (porta 80)
- **API**: http://localhost:3001
- **Database**: localhost:5432 (não exposte em produção real)

## 🔧 Comandos Úteis

```bash
# Ver todos os comandos disponíveis
make help

# Limpar containers e volumes
make clean

# Acessar shell da API
make shell-api

# Acessar shell do frontend
make shell-frontend

# Executar migrações
make migrate

# Construir imagens sem iniciar
make build

# Construir imagens de produção
make build-prod
```

## 🗄️ Gerenciamento do Banco de Dados

### Migrações

```bash
# Desenvolvimento
make migrate

# Produção
make migrate-prod
```

### Backup (Produção)

```bash
# Criar backup
docker-compose -f docker-compose.prod.yml exec db pg_dump -U postgres nexus_flow > backup.sql

# Restaurar backup
docker-compose -f docker-compose.prod.yml exec -T db psql -U postgres nexus_flow < backup.sql
```

## 🔒 Segurança

### Desenvolvimento
- CORS configurado para localhost
- Swagger habilitado
- Rate limiting desabilitado
- Logs em modo debug

### Produção
- CORS restrito ao domínio
- Swagger desabilitado
- Rate limiting habilitado
- SSL/TLS recomendado (use nginx proxy)
- Senhas fortes para banco de dados

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro de permissão nos scripts**:
   ```bash
   chmod +x scripts/*.sh
   ```

2. **Containers não iniciam**:
   ```bash
   make clean
   make dev
   ```

3. **Erro de migração**:
   ```bash
   make shell-api
   npx prisma migrate reset
   ```

4. **Problemas de CORS**:
   - Verifique a variável `CORS_ORIGINS` no `.env`
   - Certifique-se de que a URL do frontend está correta

## 📝 Logs

```bash
# Ver logs de todos os serviços
make logs

# Ver logs de um serviço específico
docker-compose logs -f api
docker-compose logs -f frontend
docker-compose logs -f db
```

## 🚨 Deploy em Produção

Para deploy real em produção:

1. Use um proxy reverso (nginx/traefik)
2. Configure SSL/TLS
3. Use variáveis de ambiente seguras
4. Configure backup automático do banco
5. Monitore os logs e métricas
6. Use um banco de dados gerenciado se possível

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs: `make logs`
2. Limpe o ambiente: `make clean`
3. Reconstrua: `make dev`
4. Verifique as configurações no `.env` 