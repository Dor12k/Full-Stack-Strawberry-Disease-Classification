from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from rest_framework.exceptions import ValidationError

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
    date_joined = models.DateTimeField(auto_now_add=True)

    password = models.CharField(max_length=128, blank=False)

    student_id = models.CharField(max_length=10, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'  # ← main field to signin
    REQUIRED_FIELDS = ['username']  # ← require too for superuser

    def __str__(self):
        return self.email
