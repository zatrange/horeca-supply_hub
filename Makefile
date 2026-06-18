.PHONY: up down build logs certs

up: certs
	docker compose up --build -d

down:
	docker compose down

clean:
	docker compose down -v

build:
	docker compose build

seed:
	docker exec horeca-supply-hub-api-1 npx prisma db push
	docker exec horeca-supply-hub-api-1 npm run seed

logs:
	docker compose logs -f

certs:
	@if [ ! -d "nginx/certs" ]; then \
		mkdir -p nginx/certs; \
		openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
		-keyout nginx/certs/nginx.key -out nginx/certs/nginx.crt \
		-subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"; \
		echo "Self-signed certificates generated."; \
	fi
