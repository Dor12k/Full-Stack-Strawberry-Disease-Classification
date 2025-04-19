

from django.contrib import admin
from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'is_active', 'date_joined')
    list_display_links = ('id', 'username')  # מאפשר ללחוץ על ה-ID או השם

