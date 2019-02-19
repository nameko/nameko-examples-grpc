build:
	npm run build

start: build
	npm run start

lint:
	npm run lint

proto:
	node_modules/.bin/grpc_tools_node_protoc \
	--proto_path=../products/products/proto \
	--js_out=import_style=commonjs,binary:src/proto \
	--grpc_out=src/proto \
	--plugin=protoc-gen-grpc=node_modules/.bin/grpc_tools_node_protoc_plugin \
	../products/products/proto/products.proto
