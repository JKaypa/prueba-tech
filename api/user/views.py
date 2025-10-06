from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate, login
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserRegisterSerializer, UserLoginSerializer
from .models import User

def generate_token(user):
    refresh = RefreshToken.for_user(user)
    return str(refresh.access_token)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = UserRegisterSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({
            'error': "Bad Request",
            'message': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    user = serializer.save()
    token = generate_token(user)
    return Response({
        "user": UserRegisterSerializer(user).data,
        "token": token
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    serializer = UserLoginSerializer(data=request.data)

    if not serializer.is_valid():
        return Response({
            'error': "Bad Request",
            'message': serializer.errors["non_field_errors"][0] 
        }, status=status.HTTP_400_BAD_REQUEST)

    user = serializer.validated_data['user']

    login(request, user)
    token = generate_token(user)

    return Response({
        'user': UserRegisterSerializer(user).data,
        'token': token,
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user
    serializer = UserRegisterSerializer(user)
    return Response(serializer.data)
