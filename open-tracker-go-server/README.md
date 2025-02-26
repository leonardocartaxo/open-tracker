# open-tracker-go-server

Open source tracker server

## Run
```shell
go run cmd/api/main.go
```

## Docs
http://localhost:8080/swagger/index.html
### Update API docs
```shell
./scripts/gen_doc.sh
```

## Migrations
### Sync DB
```shell
go run cmd/migrate/main.go up
```
Or use auto migrate by setting env var to `DB_AUTO_MIGRATE=true`

### Generate an migration DB
Enable DB_AUTO_MIGRATE and DB_DEBUG flags to see on the migration logs query and then create a migration with this command:
```shell
go run cmd/migrate/main.go create <migration name> sql
```
### Execute on docker
```shell
docker-compose up
```

## TODO
* handle api errors
* review all DTOs and swagger docs
* unit tests
* e2e test
* fix api response for duplicated items on DB
* fix migrations
* create a health endpoint
