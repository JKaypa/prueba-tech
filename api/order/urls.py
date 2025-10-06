from django.urls import path
from .views import create_order, get_orders

urlpatterns = [
    path("orders/", get_orders, name="get-orders"),
    path("orders/create/", create_order, name="create-order"),
]
