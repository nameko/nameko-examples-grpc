TAG ?= dev
# docker

run-wheel-builder:
	docker run --rm \
		-v "$$(pwd)":/application -v "$$(pwd)"/wheelhouse:/wheelhouse \
		nameko-example-builder;

build-image:
	docker build -t nameko/nameko-example-products:$(TAG) -f docker.run .;

push-image:
	docker push nameko/nameko-example-products:$(TAG)

build-proto:
	python -m grpc_tools.protoc -I products/proto \
	--python_out=products/proto \
	--grpc_python_out=products/proto \
	products/proto/products.proto
	sed -i.bak 's/^\(import.*_pb2\)/from . \1/' products/proto/*.py
	rm products/proto/*.bak
