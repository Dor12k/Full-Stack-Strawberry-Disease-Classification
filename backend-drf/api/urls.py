


from django.urls import path, include
from accounts import views as UserViews
from article import views as ArticleViews
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

    # Path to home page for members acounts
    path('protected-view/', UserViews.ProtectedView.as_view()),

    # Path to articles page
    path('articles/<slug:article_slug>/feedback/', ArticleViews.SubmitFeedbackView.as_view(), name='submit-feedback'), # Article post review
    path('articles/<slug:article_slug>/', ArticleViews.article_page, name='article-detail'), # Article page
    path('articles/', ArticleViews.ArticleCreateAPIView.as_view(), name='article-list'), # Articles category

    # Path to get all Subjects
    
    path('subjects/', ArticleViews.get_subjects, name='get-subjects'),

    # Path to get all Authors
    path('authors/', ArticleViews.get_authors, name='get-authors'),

]
