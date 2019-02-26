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

install-gateway:
	SERVICE_NAME=gateway $(MAKE) install-chart

install-orders:
	SERVICE_NAME=orders $(MAKE) install-chart

install-products:
	SERVICE_NAME=products $(MAKE) install-chart
