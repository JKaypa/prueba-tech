from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Order
from .serializers import OrderSerializer
from user.permissions import IsUser
from rest_framework.permissions import IsAuthenticated
from product.models import Product

@api_view(['GET'] )
@permission_classes([IsAuthenticated])
def get_orders(request):
    if request.user.role == 'admin':
        orders = Order.objects.all().order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
    elif request.user.role == 'user':
        orders = Order.objects.filter(user=request.user).order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsUser])
def create_order(request):
    serializer = OrderSerializer(data=request.data, context={"request": request})
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    order = serializer.save()
    return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


