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
    def create(self, request, context):
        self.storage.create({
            "id": request.id,
            "title": request.title,
            "passenger_capacity": request.passenger_capacity,
            "maximum_speed": request.maximum_speed,
            "in_stock": request.in_stock,
        })
        return request

    @grpc
    def get(self, request, context):
        product_id = request.id
        product = self.storage.get(product_id)
        data = schemas.Product().dump(product).data
        return Product(**data)

    @rpc
    def list(self):
        products = self.storage.list()
        return schemas.Product(many=True).dump(products).data

    @event_handler('orders', 'order_created')
    def handle_order_created(self, payload):
        for product in payload['order']['order_details']:
            self.storage.decrement_stock(
                product['product_id'], product['quantity'])
