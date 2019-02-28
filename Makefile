.PHONY: proto
SHELL = /bin/bash

IMAGES ?= orders products gateway
TAG ?= $(shell git rev-parse HEAD)

CONTEXT ?= docker-for-desktop
NAMESPACE ?= examples

DOCKER_HUB_ORG ?= nameko

install-dependencies:
	pip install -U -e "orders/.[dev]"
	pip install -U -e "products/.[dev]"
	make -C gateway install

# Generate Proto

products-proto:
	python -m grpc_tools.protoc \
	--proto_path=proto \
	--python_out=products/products \
	--grpc_python_out=products/products \
	products.proto
	@# Hack untill I figure how to invoke this piece of code:
	@# https://github.com/grpc/grpc/pull/10862/files
	@sed -i.bak 's/^\(import.*_pb2\)/from . \1/' products/products/*grpc.py
	@rm products/products/*.bak

orders-proto:
	python -m grpc_tools.protoc \
	--proto_path=proto \
	--python_out=orders/orders \
	--grpc_python_out=orders/orders \
	orders.proto
	@# Hack untill I figure how to invoke this piece of code:
	@# https://github.com/grpc/grpc/pull/10862/files
	@sed -i.bak 's/^\(import.*_pb2\)/from . \1/' orders/orders/*grpc.py
	@rm orders/orders/*.bak

proto: products-proto orders-proto

# Run examples locally

# Relies on `nodemon` nodejs utility installed globally:
# `$ sudo npm install -g nodemon --unsafe-perm=true --allow-root`

develop-orders:
	nodemon --ext py --watch orders/orders --watch orders/config.yaml \
	--exec "nameko run --config orders/config.yaml orders.service"

develop-products:
	nodemon --ext py --watch products/products --watch products/config.yaml --exec "nameko run --config products/config.yaml products.service"

develop-gateway:
	make -C gateway develop

develop: proto
	$(MAKE) -j3 develop-orders develop-products develop-gateway

# test

test:
	rm .coverage || true
	flake8 orders products
	coverage run --append -m pytest orders/test $(ARGS)
	coverage run --append -m pytest products/test $(ARGS)

coverage-report:
	coverage report -m

coverage-html:
	coverage html --fail-under 100

coverage: test coverage-report coverage-html

# docker

build-images: proto
	for image in $(IMAGES) ; do TAG=$(TAG) DOCKER_HUB_ORG=$(DOCKER_HUB_ORG) make -C $$image build-image; done

push-images:
	for image in $(IMAGES) ; do make -C $$image TAG=$(TAG) DOCKER_HUB_ORG=$(DOCKER_HUB_ORG) push-image; done

# Kubernetes

deploy-postgresql:
	helm upgrade $(NAMESPACE)-postgresql stable/postgresql \
    --install --namespace=$(NAMESPACE) --kube-context=$(CONTEXT) \
    --set fullnameOverride=postgresql \
    --set resources.requests.cpu=10m \
    --set resources.requests.memory=50Mi \
    --set readinessProbe.initialDelaySeconds=60 \
    --set livenessProbe.initialDelaySeconds=60;

deploy-redis:
	helm upgrade $(NAMESPACE)-redis stable/redis \
    --install --namespace $(NAMESPACE) --kube-context=$(CONTEXT) \
    --set fullnameOverride=redis \
    --set cluster.enabled=false

deploy-rabbitmq:
	helm upgrade $(NAMESPACE)-rabbitmq stable/rabbitmq-ha \
    --install --namespace=$(NAMESPACE) --kube-context=$(CONTEXT) \
    --set fullnameOverride=rabbitmq \
    --set image.tag=3.7-management-alpine \
    --set replicaCount=1 \
    --set persistentVolume.enabled=true \
    --set updateStrategy=RollingUpdate \
    --set rabbitmqMemoryHighWatermarkType=relative \
    --set rabbitmqMemoryHighWatermark=0.5

deploy-dependencies: deploy-postgresql deploy-redis deploy-rabbitmq

deploy-services:
	for image in $(IMAGES) ; do TAG=$(TAG) DOCKER_HUB_ORG=$(DOCKER_HUB_ORG) make -C charts install-$$image; done

# https://www.telepresence.io

telepresence:
	telepresence --context $(CONTEXT) \
	--namespace $(NAMESPACE) --method vpn-tcp
