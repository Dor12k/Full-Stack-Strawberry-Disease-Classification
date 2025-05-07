



# views.py

import os

from rest_framework import status
from rest_framework import viewsets
from django.shortcuts import render
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

from django.conf import settings
from django.core.files import File
from django.core.files.base import ContentFile

from .models import CustomUser
from .permissions import IsOwner
from .serializers import CustomUserSerializer
from .serializers import CustomTokenObtainPairSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from .models import user_profile_picture_upload_path



# Login users
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

            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
        
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
    
    def update(self, request, *args, **kwargs):
        if request.user.email == "guest@example.com":
            return Response({"error": "Guest users cannot update their profile."}, status=403)
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        if request.user.email == "guest@example.com":
            return Response({"error": "Guest users cannot update their profile."}, status=403)
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if request.user.email == "guest@example.com":
            return Response({"error": "Guest users cannot delete their account."}, status=403)
        return super().destroy(request, *args, **kwargs)

# Only login users can see
class ProtectedView(APIView):

    permission_classes = [IsAuthenticated, IsOwner]

    def get(self, request):
        response = {'status': 'Request was permitted'}

        return Response(response)

# Guest user permission
class GuestLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        User = get_user_model()
        guest_email = "guest@example.com"
        password = "Guestpassword123"
        guest_username = "Guest"

        guest_user, created = User.objects.get_or_create(
            email=guest_email,
            defaults={
                "username": guest_username,
                "first_name": "Guest",
                "last_name": "User",
                "is_active": True,
                "is_staff": False,
                "is_guest": True,
            }
        )

        if created:
            guest_user.set_password(password)

            # Load image content from static path
            static_image_path = os.path.join(settings.BASE_DIR, 'static/images/Panda-icon.png')
            with open(static_image_path, 'rb') as f:
                image_content = f.read()

            guest_user.profile_picture.save('profile_picture.png', ContentFile(image_content), save=True)

            guest_user.save()

        # ✅ Add context with request
        serializer = CustomTokenObtainPairSerializer(
            data={
                'email': guest_email,
                'password': password
            },
            context={'request': request}
        )

        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)




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
