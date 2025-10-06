from rest_framework import serializers

from product.models import Product
from .models import Order, OrderItem
from product.models import Product


class ProductSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price']


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSimpleSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        source='product',
        write_only=True
    )

    class Meta:
        model = OrderItem
        fields = ['product', 'product_id', 'quantity', 'total_price']
        read_only_fields = ['total_price', 'order']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['user']

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        user = self.context["request"].user

        order = Order.objects.create(user=user)

        for item_data in items_data:
            product = item_data["product"]
            quantity = item_data["quantity"]

            if product.stock < quantity:
                raise serializers.ValidationError(
                    {"product": f"Not enough stock for '{product.name}'."}
                )

            total_price = product.price * quantity

            product.stock -= quantity
            product.save()

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                total_price=total_price
            )

        return order
