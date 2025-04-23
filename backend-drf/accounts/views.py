

from rest_framework import status
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.shortcuts import render

from .models import CustomUser
from .permissions import IsOwner
from .serializers import CustomUserSerializer
from .serializers import CustomTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        else:
            errors = serializer.errors.copy()
            
            email = request.data.get("email", "").strip()
            password = request.data.get("password", "").strip()

            if not email:
                errors["email"] = ["Email cannot be empty."]

            if not password:
                errors["password"] = ["Password cannot be empty."]

            return Response(
                errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        
        
# Register with viewsets
class CustomUserViewSet(viewsets.ModelViewSet):
    
    queryset = CustomUser.objects.all()  
    serializer_class = CustomUserSerializer  

    def get_permissions(self):
        """
        Return different permissions depending on the action.
        """
        if self.action == 'create':
            return [AllowAny()]
        elif self.action in ['retrieve', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsOwner()]
        elif self.action == 'list':
            return [IsAdminUser()]
        return [IsAuthenticated()]

# Only login users can see
class ProtectedView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        response = {
            'status': 'Request was permitted'
        }
        return Response(response)


if True:
        
    # Class based view
    # class SignUpView(APIView):
    # 
    #     def post(self, request):
    #         serializer = CustomUserSerializer(data=request.data)
            
    #         if serializer.is_valid():
    #             serializer.save()
    #             return Response(serializer.data, status=status.HTTP_201_CREATED)
            
    #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    #
    # ------------------------------------------------------------------------------------------
        

    # Mixins
    # class SignUpView(mixins.CreateModelMixin, generics.GenericAPIView):
    #     queryset = CustomUser.objects.all()
    #     serializer_class = CustomUserSerializer

    #     def post(self, request, *args, **kwargs):
    #         return self.create(request, *args, **kwargs)
    #
    # ------------------------------------------------------------------------------------------

    # Generics - POST
    # class UserCreateView(generics.CreateAPIView):
    #     queryset = CustomUser.objects.all() # lazy query CustomUser.objects.all()
    #     serializer_class = CustomUserSerializer

    # Generic - GET
    # class UserListView(generics.ListAPIView):
    #     queryset = CustomUser.objects.all()  
    #     serializer_class = CustomUserSerializer  
    #
    # ------------------------------------------------------------------------------------------

    # Viewsets
    # class CustomUserViewSet(viewsets.ModelViewSet):
    #     queryset = CustomUser.objects.all()  
    #     serializer_class = CustomUserSerializer  
    # 
    # 
    # ------------------------------------------------------------------------------------------

    pass
