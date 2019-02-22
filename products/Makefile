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
	python -m grpc_tools.protoc \
	--proto_path=products/proto \
	--python_out=products/proto \
	--grpc_python_out=products/proto \
	products.proto
	@# Hack untill I figure how to invoke this piece of code:
	@# https://github.com/grpc/grpc/pull/10862/files
	@sed -i.bak 's/^\(import.*_pb2\)/from . \1/' products/proto/*.py
	@rm products/proto/*.bak

start: build-proto
	nameko run --config config.yaml products.service --backdoor 3000

# Relies on `nodemon` nodejs utility installed globally:
# `$ sudo npm install -g nodemon --unsafe-perm=true --allow-root`

develop: build-proto
	nodemon --ext py --watch products --watch config.yaml --exec "nameko run --config config.yaml products.service"
