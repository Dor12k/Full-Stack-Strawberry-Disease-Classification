


from django.urls import path, include
from accounts import views as UserViews
from article import views as ArticleViews
from rest_framework.routers import DefaultRouter
from accounts.views import CustomUserViewSet 
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from article.views import ArticleViewSet, FeedbackViewSet, SubjectViewSet, AuthorViewSet
from rest_framework_nested.routers import NestedDefaultRouter
from classification.views import DiseaseViewSet, DiseaseImageViewSet

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


urlpatterns = [

    # ViewSets routes
    path('', include(router.urls)),  # All request for CustomUser
    path('', include(articles_router.urls)),

    # djangorestframework-simplejwt 
    path('token/', UserViews.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Path to home page for members acounts
    path('protected-view/', UserViews.ProtectedView.as_view()),
]
