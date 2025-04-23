


# File name: article/views.py


from rest_framework import status
from rest_framework import parsers
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from article.models import Article, Feedback,Subject, Author
from article.serializers import ArticleSerializer, FeedbackSerializer, SubjectSerializer, AuthorSerializer
from django.contrib.auth.models import AnonymousUser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.generics import CreateAPIView

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

class ArticleCreateAPIView(CreateAPIView):
    
    permission_classes = [IsAuthenticated]  
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def get(self, request):
        articles = Article.objects.all().order_by("-average_rating")
        article_serializer = ArticleSerializer(articles, many=True, context={"request": request})
        return Response({"articles": article_serializer.data}, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ArticleSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Article submitted successfully!', 'article': serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Article page - return article with feedback
@api_view(['GET', 'POST'])
def article_page(request, article_slug):

    try:
        article = Article.objects.get(slug=article_slug)
    except Article.DoesNotExist:
        return Response({"error": "Article not found"}, status=status.HTTP_404_NOT_FOUND)


    # Extract the related FeedBack model
    article_reviews = Feedback.objects.filter(article=article)

    if request.method == "GET":
        # Serialize the article and reviews
        article_serializer = ArticleSerializer(article, context={'request': request})
        reviews_serializer = FeedbackSerializer(article_reviews, many=True)
        return Response({
            "article": article_serializer.data,
            "reviews": reviews_serializer.data,
        })

    elif request.method == "POST":
        if isinstance(request.user, AnonymousUser):
            return Response({"error": "You must sign in"}, status=status.HTTP_400_BAD_REQUEST)

        form = FeedbackSerializer(data=request.data)

        if form.is_valid():
            # Check if the user already reviewed this article
            user_account = request.user.account  # Assuming you have a Profile model
            existing_feedback = Feedback.objects.filter(user=user_account, article=article).first()

            if existing_feedback:
                # Update existing feedback
                form = FeedbackSerializer(existing_feedback, data=request.data, partial=True)
                if form.is_valid():
                    form.save()
                    return Response({"message": "Your feedback was updated successfully."}, status=status.HTTP_200_OK)
                return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                # Create new feedback
                feedback = form.save(commit=False)
                feedback.article = article
                feedback.user = user_account
                feedback.save()
                # Update article rating
                article.num_of_reviews += 1
                article.average_rating = (article.average_rating * (article.num_of_reviews - 1) + feedback.rating) / article.num_of_reviews
                article.save()
                return Response({"message": "Your feedback was submitted successfully."}, status=status.HTTP_201_CREATED)
        return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)

# Article category page - return all articles by rating
@api_view(['GET'])
def article_cat(request):
    articles = Article.objects.all().order_by("-average_rating")
    article_serializer = ArticleSerializer(articles, many=True, context={"request": request})
    return Response({"articles": article_serializer.data})

# Subjects
@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_subjects(request):
    subjects = Subject.objects.all()
    serializer = SubjectSerializer(subjects, many=True, context={'request': request})
    return Response(serializer.data)

# Authors
@api_view(['GET'])
def get_authors(request):
    authors = Author.objects.all()
    serializer = AuthorSerializer(authors, many=True, context={'request': request})
    return Response(serializer.data)


# Manage user reviews 
class SubmitFeedbackView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, article_slug):
        try:
            article = Article.objects.get(slug=article_slug)
        except Article.DoesNotExist:
            return Response({'error': 'Article not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = FeedbackSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(article=article)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)






