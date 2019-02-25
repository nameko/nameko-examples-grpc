TAG ?= dev
# docker

run-wheel-builder:
	docker run --rm \
		-v "$$(pwd)":/application -v "$$(pwd)"/wheelhouse:/wheelhouse \
		nameko-examples-grpc-builder;

build-image:
	docker build -t jakubborys/nameko-examples-grpc-products:$(TAG) .;

push-image:
	docker push jakubborys/nameko-examples-grpc-products:$(TAG)
