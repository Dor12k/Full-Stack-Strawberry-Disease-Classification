

import re
from .models import CustomUser
from rest_framework import serializers

# Custom Email Validation
def custom_email_validation(email, target='login'):

    if target in ('create', 'update'):
        if CustomUser.objects.filter(email=email).exists():
            raise serializers.ValidationError("Email already exists.")
    
    if not email:
        raise serializers.ValidationError("Email cannot be empty.")
    
    if re.search(r'\s', email):
        raise serializers.ValidationError("Email can't contain spaces.")
    
    if re.search(r'[!#$%^&*(),?":{}|<>]', email):
        raise serializers.ValidationError("Email can't contain special characters.")

# Custom Username Validation
def custom_username_validation(username, target='login'):        

    if target in ('create', 'update'): # Skip on this if target='login'
        if CustomUser.objects.filter(username=username).exists():
            raise serializers.ValidationError("Username already exists.")
        
    if not username or username == "":
        raise serializers.ValidationError("Username cannot be empty.")

    if re.search(r'\s', username):
        raise serializers.ValidationError("Username can't contain spaces.")
    
    if re.search(r'[!@#$%^&*(),.?":{}|<>]', username):
        raise serializers.ValidationError("Username can't contain special characters.")

# Custom Password Validation
def custom_password_validation(password, target='login'):
    
    if not re.search(r'[A-Z]', password):
        raise serializers.ValidationError("Password must contain at least one uppercase letter.")
    
    if not re.search(r'[0-9]', password):
        raise serializers.ValidationError("Password must contain at least one number.")
    
    if not re.search(r'[!@#$%^&*(),.?":{}|<>+-]', password):
        raise serializers.ValidationError("Password must contain at least one special character.")
