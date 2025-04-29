

from django.contrib import admin
from .models import Article, Author, Subject, Feedback

# Subject
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('title',)
    search_fields = ('title',)


# Author
class AuthorAdmin(admin.ModelAdmin):
    list_display = ('id', 'name',)
    search_fields = ('name',)


# Article
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('id', 'order', 'title', 'author', 'is_bestSeller', 'num_of_reviews', 'average_rating')
    list_filter = ('is_bestSeller', 'subject', 'author')
    search_fields = ('title', 'description', 'author__name')
    prepopulated_fields = {'slug': ('title',)}  # Creatie slug by title
    raw_id_fields = ('author',)  # ID raw for author
    filter_horizontal = ('subject',)  # filter by subject


# Feedback
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('article', 'username', 'rating', 'user')
    list_filter = ('rating',)
    search_fields = ('article__title', 'username', 'text')

#
admin.site.register(Subject, SubjectAdmin)
admin.site.register(Author, AuthorAdmin)
admin.site.register(Article, ArticleAdmin)
admin.site.register(Feedback, FeedbackAdmin)
