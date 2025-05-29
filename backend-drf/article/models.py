
# File name: article/models.py
import os
from django.db import models
from accounts.models import CustomUser
from django.utils.text import slugify
from django.core.validators import MaxValueValidator, MinValueValidator


# Article subject
class Subject(models.Model):
    title = models.CharField(max_length=50)
    
    def __str__(self):
        return f"{self.title}"
    

def author_image_upload_to(instance, filename):
    return f'images/article/author/{instance.name}/{filename}'

# Article author
class Author(models.Model):
    
    name = models.CharField(max_length=70)
    subject = models.ManyToManyField(Subject)
    picture = models.ImageField(blank=True, null=True, upload_to=author_image_upload_to)

    def __str__(self):
        return f"{self.name}"


# Define image path when am image uploaded     
def article_file_upload_to(instance, filename):

    ext = os.path.splitext(filename)[1].lower() # Get extension, like .jpg or .mp4

    if ext in ['.jpg', '.jpeg', '.png', '.gif', '.webp']:
        folder = 'images'
    elif ext in ['.mp4', '.webm', '.ogg', '.mov', '.avi']:
        folder = 'videos'
    else:
        folder = 'files'
    
    return f'media/{folder}/article/article/{instance.slug}/{filename}'


# Article instance
class Article(models.Model):
        
    slug = models.SlugField(blank=True, unique=True)

    title = models.CharField(max_length=450)
    description = models.TextField(max_length=500) # 319
    introduction = models.TextField(max_length=500)

    first_paragraph = models.TextField()
    first_media = models.FileField(blank=True, null=True, upload_to=article_file_upload_to)

    second_paragraph = models.TextField()
    second_media = models.FileField(blank=True, null=True, upload_to=article_file_upload_to)

    third_paragraph = models.TextField()
    third_media = models.FileField(blank=True, null=True, upload_to=article_file_upload_to)

    subject = models.ManyToManyField(Subject)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)

    is_bestSeller = models.BooleanField(default=False)
    num_of_reviews = models.PositiveBigIntegerField(default=0)
    average_rating = models.FloatField(default=0, validators=[MinValueValidator(0), MaxValueValidator(5)])

    card = models.CharField(max_length=20, default='regular', null=True)

    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.title}"

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while Article.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)


# Article feedback
class Feedback(models.Model):
    
    text = models.TextField(max_length=330)
    username = models.CharField(max_length=40)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True)
    article = models.ForeignKey(Article, on_delete=models.CASCADE, null=True, related_name='feedbacks')
    rating = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(5)])

    def __str__(self):
        return f"{self.article} - Rating {self.rating}"
   