

# File name: /api/urls.py
from django.urls import path, include
from accounts import views as UserViews
from article import views as ArticleViews
from accounts.views import CustomUserViewSet 
from rest_framework.routers import DefaultRouter
from rest_framework_nested.routers import NestedDefaultRouter
from classification.views import DiseaseViewSet, DiseaseImageViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from article.views import ArticleViewSet, FeedbackViewSet, SubjectViewSet, AuthorViewSet

from classification.views import view_disease_image
# get_recent_images_from_redis

# Create Router
router = DefaultRouter()
router.register(r'users', CustomUserViewSet )
router.register(r'diseases', DiseaseViewSet, basename='diseases')
router.register(r'disease-images', DiseaseImageViewSet, basename='disease-images')
router.register(r'articles', ArticleViewSet, basename='articles')
router.register(r'subjects', SubjectViewSet, basename='subjects')
router.register(r'authors', AuthorViewSet, basename='authors')

# Nested routes: feedback under articles
articles_router = NestedDefaultRouter(router, r'articles', lookup='article')
articles_router.register(r'feedback', FeedbackViewSet, basename='article-feedback')

# Nested routes for disease and disease images
diseases_router = NestedDefaultRouter(router, r'diseases', lookup='disease')
diseases_router.register(r'images', DiseaseImageViewSet, basename='disease-images')


urlpatterns = [

    # ViewSets routes
    path('', include(router.urls)),  # All request for CustomUser
    path('', include(articles_router.urls)),

    # djangorestframework-simplejwt 
    path('token/', UserViews.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Path to home page for members acounts
    path('protected-view/', UserViews.ProtectedView.as_view()),

    # Path to guest users
    path('guest-login/', UserViews.GuestLoginView.as_view(), name='guest-login'),


    # New paths for disease image views and recent images (nested under 'diseases')
    path('diseases/<int:disease_id>/image/<int:image_id>/', view_disease_image, name='view_disease_image'),
    
]
