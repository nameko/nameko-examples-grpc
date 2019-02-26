TAG ?= latest

# docker

run-wheel-builder:
	rm -r wheelhouse || true && \
	docker run --rm \
		-v "$$(pwd)":/application -v "$$(pwd)"/wheelhouse:/wheelhouse \
		nameko-examples-grpc-builder;

build-image:
	docker build -t jakubborys/nameko-examples-grpc-orders:$(TAG) .;

push-image:
	docker push jakubborys/nameko-examples-grpc-orders:$(TAG)
