
import os
import shutil
from django.db import models
from django.conf import settings
from rest_framework.exceptions import ValidationError
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

def user_profile_picture_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f"profile_picture.{ext}"
    return f"media/images/accounts/{instance.username}/profile_picture/{filename}"


# Custom user management
class CustomUserManager(BaseUserManager):

    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")

        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, username, password, **extra_fields)


# Custom user model
class CustomUser(AbstractBaseUser, PermissionsMixin):

    email = models.EmailField(max_length=30, unique=True, blank=False, error_messages={
        'unique': 'Email already exists.',
        'blank': 'Email cannot be empty.'
    })
    username = models.CharField(max_length=30, unique=True, blank=False, error_messages={
        'unique': 'Username already exists.',
        'blank': 'Username cannot be empty.'
    })

    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_premium = models.BooleanField(default=False)
    is_guest = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    password = models.CharField(max_length=128, blank=False)

    student_id = models.CharField(max_length=10, blank=True, null=True)
    profile_picture = models.ImageField(upload_to=user_profile_picture_upload_path, blank=True, null=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'  # ← main field to signin
    REQUIRED_FIELDS = ['username']  # ← require too for superuser

    def __str__(self):
        return self.email

    def save(self, *args, **kwargs):
        try:
            old_instance = CustomUser.objects.get(pk=self.pk)
            old_username = old_instance.username
        except CustomUser.DoesNotExist:
            old_username = None

        super().save(*args, **kwargs)  # Default save

        # If username has changed, move image to a new folder
        if old_username and old_username != self.username and self.profile_picture:
            
            # Define old and new paths
            old_path = os.path.join(settings.MEDIA_ROOT, 'images', 'accounts', old_username, 'profile_picture')
            new_path = os.path.join(settings.MEDIA_ROOT, 'images', 'accounts', self.username, 'profile_picture')

            # Check if old path exists
            if os.path.exists(old_path):
                # Create the new folder if not exists
                os.makedirs(new_path, exist_ok=True)
                
                # Move all files from the old folder to the new one
                for filename in os.listdir(old_path):
                    old_file_path = os.path.join(old_path, filename)
                    new_file_path = os.path.join(new_path, filename)
                    shutil.move(old_file_path, new_file_path)
                    
                # After moving files, check if old directory is empty
                if not os.listdir(old_path):  # Directory should be empty after moving files
                    shutil.rmtree(old_path)

                    # After deleting 'profile_picture' folder
                    user_old_dir = os.path.join(settings.MEDIA_ROOT, 'images', 'accounts', old_username)    

                    # If the user directory is now empty, remove it too
                    if os.path.isdir(user_old_dir) and not os.listdir(user_old_dir):
                        os.rmdir(user_old_dir)
  
                    
                # Update the image path in the model
                ext = self.profile_picture.name.split('.')[-1]
                self.profile_picture.name = f"images/accounts/{self.username}/profile_picture/profile_picture.{ext}"
                super().save(update_fields=['profile_picture'])


