from django.urls import path
from .views import get_products, create_product

urlpatterns = [
    path('products/', get_products, name='get_products'),
    path('products/create/', create_product, name='create_product'),
]