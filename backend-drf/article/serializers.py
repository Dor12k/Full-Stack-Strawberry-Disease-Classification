

# File name: article/serializers.py
from rest_framework import serializers
from article.models import Article, Author, Subject, Feedback




class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'title']


class FeedbackSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True) 
    class Meta:
        model = Feedback
        fields = ['id', 'text', 'username', 'user', 'rating']
        read_only_fields = ['user', 'article']

    def validate_rating(self, value):
        if not (0 <= value <= 5):
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value

    def validate_text(self, value):
        if not value.strip():
            raise serializers.ValidationError("Comment cannot be empty.")
        return value

    def validate(self, data):
        request = self.context['request']
        if data.get("username") != request.user.username:
            raise serializers.ValidationError("You can only submit feedback using your own username.")
        return data





class AuthorSerializer(serializers.ModelSerializer):

    # Write picture
    picture = serializers.ImageField(required=False, allow_null=True)

    # Read only
    picture_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Author
        fields = ['id', 'name', 'picture', 'picture_url']
    
    def get_picture_url(self, obj):
        request = self.context.get('request')
        if obj.picture and request:
            return request.build_absolute_uri(obj.picture.url)
        elif obj.picture:
            return obj.picture.url  # fallback without full URL
        return None


class ArticleSerializer(serializers.ModelSerializer):
    
    slug = serializers.SlugField(read_only=True)

    author_details = AuthorSerializer(source='author', read_only=True)
    author = serializers.PrimaryKeyRelatedField(queryset=Author.objects.all(), write_only=True )

    subject = SubjectSerializer(many=True, read_only=True)  # List of Subject serializers
    feedback = FeedbackSerializer(many=True, read_only=True)  # List of Feedback serializers
    
    # Write pictures
    first_media = serializers.ImageField(required=False, allow_null=True)
    second_media = serializers.ImageField(required=False, allow_null=True)
    third_media = serializers.ImageField(required=False, allow_null=True)

    # Read only
    first_media_url = serializers.SerializerMethodField()
    second_media_url = serializers.SerializerMethodField()
    third_media_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Article
        fields = [
            'id', 'title', 'description', 'introduction',
            'first_paragraph', 'first_media', 'first_media_url',
            'second_paragraph', 'second_media', 'second_media_url',
            'third_paragraph', 'third_media', 'third_media_url',
            'slug', 'subject', 'author', 'author_details',
            'is_bestSeller', 'num_of_reviews', 'average_rating',
            'card', 'feedback'
        ]
        
    def get_first_media_url(self, obj):
        request = self.context.get('request')
        if obj.first_media and request:
            return request.build_absolute_uri(obj.first_media.url)
        elif obj.first_media:
            return obj.first_media.url
        return None

    def get_second_media_url(self, obj):
        request = self.context.get('request')
        if obj.second_media and request:
            return request.build_absolute_uri(obj.second_media.url)
        elif obj.second_media:
            return obj.second_media.url
        return None

    def get_third_media_url(self, obj):
        request = self.context.get('request')
        if obj.third_media and request:
            return request.build_absolute_uri(obj.third_media.url)
        elif obj.third_media:
            return obj.third_media.url
        return None

    def validate_first_media(self, file):
        return self._validate_media(file)

    def validate_second_media(self, file):
        return self._validate_media(file)

    def validate_third_media(self, file):
        return self._validate_media(file)

    def _validate_media(self, file):
        if file and not file.content_type.startswith(('image/', 'video/')):
            raise serializers.ValidationError("Only image or video files are allowed.")
        return file
    







