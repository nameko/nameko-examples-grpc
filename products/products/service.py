import logging

from nameko.events import event_handler
from nameko.rpc import rpc
from nameko_grpc.entrypoint import Grpc

from .proto.products_pb2_grpc import productsStub
from .proto.products_pb2 import Product

from products import dependencies, schemas


logger = logging.getLogger(__name__)

grpc = Grpc.implementing(productsStub)


class ProductsService:

    name = 'products'

    storage = dependencies.Storage()

    @grpc
    def get_product(self, request, context):
        # product_id = request.id
        logger.info(f'product id received: {request.id}')
        # product = self.storage.get(product_id)
        # data = schemas.Product().dump(product).data
        # return Product(**data)
        return Product(title="Bob is your uncle", passenger_capacity=101)

    @rpc
    def get(self, product_id):
        product = self.storage.get(product_id)
        return schemas.Product().dump(product).data

    @rpc
    def list(self):
        products = self.storage.list()
        return schemas.Product(many=True).dump(products).data

    @rpc
    def create(self, product):
        product = schemas.Product(strict=True).load(product).data
        self.storage.create(product)

    @event_handler('orders', 'order_created')
    def handle_order_created(self, payload):
        for product in payload['order']['order_details']:
            self.storage.decrement_stock(
                product['product_id'], product['quantity'])
