

from django.urls import path
from django.urls import path, include
from accounts import views as UserViews
from rest_framework.routers import DefaultRouter
from accounts.views import CustomUserViewSet 
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView




# Create Router
router = DefaultRouter()
router.register(r'users', CustomUserViewSet )



urlpatterns = [

    path('', include(router.urls)),  # All request for CustomUser

    # djangorestframework-simplejwt 
    path('token/', UserViews.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('protected-view/', UserViews.ProtectedView.as_view()),

]
