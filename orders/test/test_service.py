import pytest

from nameko_grpc.client import Client

from orders.models import Order, OrderDetail
from orders.service import OrdersService
from orders.orders_pb2_grpc import ordersStub
from orders.orders_pb2 import (
    GetOrderRequest,
    CreateOrderRequest,
    CreateOrderDetailRequest,
    UpdateOrderRequest,
    UpdateOrderDetailRequest,
    DeleteOrderRequest,
)


@pytest.fixture
def config(rabbit_config, db_url):
    orders_config = rabbit_config.copy()
    orders_config['DB_URIS'] = {'orders:Base': db_url}
    return orders_config


@pytest.fixture
def service_container(config, container_factory):
    container = container_factory(OrdersService, config)
    container.start()
    yield container
    container.stop()


@pytest.fixture
def client():
    client = Client(
        "//127.0.0.1:50051",
        ordersStub
    )
    yield client.start()
    client.stop()


@pytest.fixture
def order_data():
    return {
        "id": 1,
        "order_details": [{
            "id": 1,
            "product_id": "the_odyssey",
            "price": "20.50",
            "quantity": 10
        }]
    }


@pytest.fixture
def order(db_session, order_data):
    order = Order(id=order_data["id"])
    db_session.add(order)
    db_session.add_all([
        OrderDetail(
            order=order,
            id=order_detail["id"],
            product_id=order_detail["product_id"],
            price=order_detail["price"],
            quantity=order_detail["quantity"],
        )
        for order_detail in order_data["order_details"]
    ])
    db_session.commit()
    return order


def test_get_order(service_container, client, order):
    retrieved_order = client.get_order(GetOrderRequest(id=order.id))
    assert order.id == retrieved_order.id
    order_detail = order.order_details[0]
    retrieved_order_detail = retrieved_order.order_details[0]
    assert order_detail.id == retrieved_order_detail.id
    assert order_detail.product_id == retrieved_order_detail.product_id
    assert str(order_detail.price) == retrieved_order_detail.price
    assert order_detail.quantity == retrieved_order_detail.quantity


def test_create_order(db_session, service_container, client, order_data):
    order_details = order_data["order_details"][0]
    created_order = client.create_order(
        CreateOrderRequest(
            order_details=[
                CreateOrderDetailRequest(
                    product_id=order_details["product_id"],
                    price=order_details["price"],
                    quantity=order_details["quantity"]
                )
            ]
        )
    )
    saved_order = db_session.query(Order).get(created_order.id)

    saved_order_details = saved_order.order_details[0]
    created_order_details = created_order.order_details[0]
    assert len(created_order.order_details) == 1
    assert saved_order_details.id == created_order_details.id
    assert saved_order_details.product_id == created_order_details.product_id
    assert str(saved_order_details.price) == created_order_details.price
    assert saved_order_details.quantity == created_order_details.quantity


def test_can_update_order(db_session, service_container, client, order):
    order_details = order.order_details[0]
    original_quantity = order_details.quantity
    updated_order = client.update_order(
        UpdateOrderRequest(
            id=order.id,
            order_details=[
                UpdateOrderDetailRequest(
                    id=order_details.id,
                    product_id=order_details.product_id,
                    price=str(order_details.price),
                    quantity=original_quantity + 1
                )
            ]
        )
    )
    assert updated_order.order_details[0].quantity == original_quantity + 1


def test_can_delete_order(db_session, service_container, client, order):
    client.delete_order(DeleteOrderRequest(id=order.id))
    orders = db_session.query(Order).all()
    assert orders == []
