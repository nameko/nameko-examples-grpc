CONTEXT ?= docker-for-desktop
NAMESPACE ?= examples
TAG ?= latest

deploy-namespace:
	kubectl --context=$(CONTEXT) apply -f namespace.yaml

# helm

test-chart:
	helm upgrade grpc-examples-$(SERVICE_NAME) $(SERVICE_NAME) --install \
	--namespace=$(NAMESPACE) --kube-context $(CONTEXT) \
	--dry-run --debug --set image.tag=$(TAG)

install-chart:
	helm upgrade grpc-examples-$(SERVICE_NAME) $(SERVICE_NAME) --install \
	--namespace=$(NAMESPACE) --kube-context=$(CONTEXT) \
	--set image.tag=$(TAG)

lint-chart:
	helm lint $(SERVICE_NAME) --strict


test-gateway:
	SERVICE_NAME=gateway $(MAKE) test-chart

test-orders: SERVICE_NAME=orders
test-orders: test-chart

test-products: SERVICE_NAME=products
test-products: test-chart

lint-gateway: SERVICE_NAME=gateway
lint-gateway: lint-chart

lint-orders: SERVICE_NAME=orders
lint-orders: lint-chart

lint-products: SERVICE_NAME=products
lint-products: lint-chart

install-gateway:
	SERVICE_NAME=gateway $(MAKE) install-chart

install-orders:
	SERVICE_NAME=orders $(MAKE) install-chart

install-products:
	SERVICE_NAME=products $(MAKE) install-chart
