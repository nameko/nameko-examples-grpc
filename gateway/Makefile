TAG ?= latest
DOCKER_HUB_ORG ?= nameko

install:
	npm install --loglevel=error

build:
	npm run build

start: build
	npm run start

lint:
	npm run lint

nodemon:
	npm run nodemon

watch-ts:
	npm run watch-ts

develop: build
	$(MAKE) -j2 nodemon watch-ts

build-image:
	cp -R ../proto proto
	docker build -t $(DOCKER_HUB_ORG)/nameko-examples-grpc-gateway:$(TAG) .;
	rm -r proto

push-image:
	docker push $(DOCKER_HUB_ORG)/nameko-examples-grpc-gateway:$(TAG)

# queries

create-product:
	curl 'localhost:4000/graphql' -H 'Content-Type: application/json' -d \
	'{"query":" mutation Create { createProduct( \
	input: {id:\"foo_id\", title: \"foo title\", passengerCapacity: 123, maximumSpeed:9, inStock: 100} ) \
	{ id title passengerCapacity maximumSpeed inStock } \
	}"}'

get-product:
	curl 'localhost:4000/graphql' -H 'Content-Type: application/json' -d \
	'{"query":"query GetProduct {product(id: \"foo_id\") \
	{id title passengerCapacity maximumSpeed inStock}}"}'
