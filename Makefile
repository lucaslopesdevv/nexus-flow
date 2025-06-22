.PHONY: help dev prod stop clean logs shell-api shell-frontend migrate

help: ## Mostrar ajuda
	@echo "Comandos disponíveis:"
	@echo ""
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

dev: ## Iniciar ambiente de desenvolvimento
	@chmod +x scripts/start-dev.sh
	@./scripts/start-dev.sh

prod: ## Iniciar ambiente de produção
	@chmod +x scripts/start-prod.sh
	@./scripts/start-prod.sh

stop: ## Parar todos os serviços
	@echo "🛑 Parando serviços de desenvolvimento..."
	@docker-compose down
	@echo "🛑 Parando serviços de produção..."
	@docker-compose -f docker-compose.prod.yml down

clean: ## Limpar containers, volumes e imagens
	@echo "🧹 Limpando containers e volumes..."
	@docker-compose down -v --remove-orphans
	@docker-compose -f docker-compose.prod.yml down -v --remove-orphans
	@docker system prune -f
	@echo "✅ Limpeza concluída!"

logs: ## Ver logs dos serviços (desenvolvimento)
	@docker-compose logs -f

logs-prod: ## Ver logs dos serviços (produção)
	@docker-compose -f docker-compose.prod.yml logs -f

shell-api: ## Acessar shell do container da API
	@docker-compose exec api sh

shell-frontend: ## Acessar shell do container do frontend
	@docker-compose exec frontend sh

migrate: ## Executar migrações do banco de dados
	@docker-compose exec api npx prisma migrate deploy

migrate-prod: ## Executar migrações do banco de dados (produção)
	@docker-compose -f docker-compose.prod.yml exec api npx prisma migrate deploy

build: ## Construir imagens sem iniciar
	@docker-compose build

build-prod: ## Construir imagens de produção sem iniciar
	@docker-compose -f docker-compose.prod.yml build

prod-ssl: ## Iniciar ambiente de produção com SSL (Traefik)
	@echo "🚀 Iniciando ambiente de produção com SSL..."
	@docker-compose -f docker-compose.traefik.yml up --build -d
	@echo "✅ Ambiente de produção com SSL iniciado!"
	@echo "🌐 Acesse: https://seu-dominio.com"
	@echo "🔧 Traefik Dashboard: http://localhost:8080" 