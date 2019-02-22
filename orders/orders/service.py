from nameko.events import EventDispatcher
from nameko_grpc.entrypoint import Grpc
from nameko_sqlalchemy import DatabaseSession

from .exceptions import NotFound
from .models import DeclarativeBase, Order, OrderDetail
from .schemas import OrderSchema

from .orders_pb2_grpc import ordersStub
from .orders_pb2 import OrderResponse, OrderDetailResponse, OrderDeletedResponse

grpc = Grpc.implementing(ordersStub)


class OrdersService:
    name = 'orders'

    db = DatabaseSession(DeclarativeBase)
    event_dispatcher = EventDispatcher()

    @grpc
    def get_order(self, request, context):
        order = self.db.query(Order).get(request.id)

        if not order:
            raise NotFound('Order with id {} not found'.format(request.id))

        return self._order_response(order)

    @grpc
    def create_order(self, request, context):
        order = Order(
            order_details=[
                OrderDetail(
                    product_id=order_detail.product_id,
                    price=order_detail.price,
                    quantity=order_detail.quantity,
                )
                for order_detail in request.order_details
            ]
        )
        self.db.add(order)
        self.db.commit()

        order_created = OrderSchema().dump(order).data

        self.event_dispatcher('order_created', {
            'order': order_created,
        })

        return self._order_response(order)

    @grpc
    def update_order(self, request, context):
        order_details = {
            order_details.id: order_details
            for order_details in request.order_details
        }

        order = self.db.query(Order).get(request.id)

        for order_detail in order.order_details:
            order_detail.price = order_details[order_detail.id].price
            order_detail.quantity = order_details[order_detail.id].quantity

        self.db.commit()

        return self._order_response(order)

    @grpc
    def delete_order(self, request, context):
        order = self.db.query(Order).get(request.id)
        self.db.delete(order)
        self.db.commit()
        return OrderDeletedResponse()

    def _order_response(self, order):
        return OrderResponse(
            id=order.id,
            order_details=[
                OrderDetailResponse(
                    id=order_detail.id,
                    product_id=order_detail.product_id,
                    price=str(order_detail.price),
                    quantity=order_detail.quantity,
                )
                for order_detail in order.order_details
            ]
        )
