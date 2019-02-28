TAG ?= latest
DOCKER_HUB_ORG ?= nameko

# docker

build-image:
	docker build -t $(DOCKER_HUB_ORG)/nameko-examples-grpc-orders:$(TAG) .;

push-image:
	docker push $(DOCKER_HUB_ORG)/nameko-examples-grpc-orders:$(TAG)
