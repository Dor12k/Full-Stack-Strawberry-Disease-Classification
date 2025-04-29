


# File name: article/views.py

from django.db.models import Avg
from rest_framework import status
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from article.models import Article, Feedback,Subject, Author
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from article.serializers import ArticleSerializer, FeedbackSerializer, SubjectSerializer, AuthorSerializer

# Manage all *articles/ urls
class ArticleViewSet(viewsets.ModelViewSet):
    
    queryset = Article.objects.order_by('order')
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    lookup_field = 'slug'  # This makes the router use slug instead of pk

    # Return the most 4 articles by avarage rating
    @action(detail=False, methods=['get'], url_path='popular')
    def popular_articles(self, request):
        try:
            limit = int(request.query_params.get('limit', 4))
        except ValueError:
            return Response({'error': 'limit must be an integer'}, status=status.HTTP_400_BAD_REQUEST)

        valid_card_types = ['regular', 'mid', 'horizontal', 'vertical', 'flat', 'end']
        card_type = request.query_params.get('card', 'regular')

        # Validate that the card_type is in the allowed list
        if card_type not in valid_card_types:
            return Response({'error': f'Invalid card type. Allowed types are: {", ".join(valid_card_types)}'}, 
                            status=status.HTTP_400_BAD_REQUEST)

        popular_articles = Article.objects.filter(card=card_type).order_by('-average_rating')[:limit]
        
        serializer = self.get_serializer(popular_articles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# Manage all *feedback/ urls
class FeedbackViewSet(viewsets.ModelViewSet):
    serializer_class = FeedbackSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        slug = self.kwargs.get('article_slug')
        return Feedback.objects.filter(article__slug=slug)

    def perform_create(self, serializer):
        slug = self.kwargs.get('article_slug') 
        article = Article.objects.get(slug=slug)

        # Save feedback instance
        feedback = serializer.save(user=self.request.user, article=article)

        # Update average rating and number of reviews
        article.num_of_reviews = article.feedbacks.count()
        article.average_rating = article.feedbacks.aggregate(Avg('rating'))['rating__avg'] or 0
        article.average_rating = round(article.average_rating, 1)
        article.save()


# Manage all *subjects urls
class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


# Manage all *authors urls
class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]




