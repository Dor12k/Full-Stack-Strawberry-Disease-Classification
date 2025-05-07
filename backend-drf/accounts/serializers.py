

from .models import CustomUser
from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .validators import custom_email_validation, custom_username_validation, custom_password_validation

User = get_user_model()

class CustomUserSerializer(serializers.ModelSerializer):
    
    username = serializers.CharField(max_length=30, allow_blank=False, error_messages={
        'blank': 'Username can\'t be empty.',
    })
    email = serializers.EmailField(max_length=30, allow_blank=False, error_messages={
        'blank': 'Email can\'t be empty.',
    })
    password = serializers.CharField(write_only=True, required=True, allow_blank=False, min_length=8, error_messages={
        'blank': 'Password can\'t be empty.',
    })
    new_password = serializers.CharField(write_only=True, required=False, allow_blank=True, min_length=8)

    # profile_picture = serializers.SerializerMethodField()
    profile_picture = serializers.ImageField(allow_null=True, required=False)
    
    print("profile_picture", profile_picture)

    class Meta:
        model = CustomUser
        read_only_fields = ['id', 'date_joined']
        fields = ['id', 'username', 'email', 'password', 'new_password', 'first_name', 'last_name', 'student_id', 'is_staff', 'is_premium', 'is_guest', 'profile_picture']


    def get_profile_picture(self, obj):
        request = self.context.get('request')
        if obj.profile_picture and hasattr(obj.profile_picture, 'url'):
            return request.build_absolute_uri(obj.profile_picture.url) if request else obj.profile_picture.url
        return None

    def create(self, validated_data):

        errors = {}

        # Normalize email to lowercase
        validated_data['email'] = validated_data['email'].lower()

        if 'email' in validated_data:
            try:
                custom_email_validation(validated_data['email'], 'create')
            except serializers.ValidationError as e:
                errors['email'] = e.detail
        
        if 'username' in validated_data:
            try:
                custom_username_validation(validated_data['username'], 'create')
            except serializers.ValidationError as e:
                errors['username'] = e.detail

        if 'password' in validated_data:
            try:
                custom_password_validation(validated_data['password'], 'create')
            except serializers.ValidationError as e:
                errors['password'] = e.detail

        if errors:
            raise serializers.ValidationError(errors)
        
        print(validated_data)

        return CustomUser.objects.create_user(**validated_data)

    def update(self, instance, validated_data):
        errors = {}

        print("instance", instance)
        print("validated_data", validated_data)


        # Prevent guest user from updating profile
        if instance.email == "guest@example.com":
            raise serializers.ValidationError({
                "error": "Guest account cannot be modified."
            })

        if 'password' in validated_data:
            user = get_user_model().objects.get(id=instance.id)

            if not user.check_password(validated_data['password']):
                errors['password'] = "Current password is incorrect"
                raise serializers.ValidationError(errors)

            # Continue with the update if no password errors
            if 'email' in validated_data:
                # Normalize email to lowercase
                validated_data['email'] = validated_data['email'].lower()
                if instance.email != validated_data['email']:
                    try:
                        custom_email_validation(validated_data['email'], 'update')
                    except serializers.ValidationError as e:
                        errors['email'] = e.detail
            
            if 'username' in validated_data:
                if instance.username != validated_data['username']:
                    try:
                        custom_username_validation(validated_data['username'], 'update')
                    except serializers.ValidationError as e:
                        errors['username'] = e.detail

            if 'new_password' in validated_data:
                try:
                    custom_password_validation(validated_data['new_password'])
                except serializers.ValidationError as e:
                    errors['new_password'] = e.detail
                else:
                    instance.set_password(validated_data['new_password'])

            if errors:
                raise serializers.ValidationError(errors)

            # Update other fields as needed
            for attr, value in validated_data.items():
                if attr not in ['password', 'new_password']:
                    setattr(instance, attr, value)

            instance.save()
            return instance
        else:
            errors['password'] = "Password is missing"
            raise serializers.ValidationError(errors)



class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    email = serializers.EmailField(
        required=True,
        allow_blank=False,
        error_messages={
            'required': 'Please provide an email address.',
            'blank': 'Email cannot be empty.',
            'invalid': 'Please enter a valid email address.'
        },
    )

    password = serializers.CharField(
        write_only=True,
        required=True,
        allow_blank=False,
        min_length=8,
        error_messages={
            'required': 'Please provide a password.',
            'blank': 'Password cannot be empty.',
            'min_length': 'Password must be at least 8 characters long.'
        }
    )

            
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
    def validate(self, attrs):
        
        email = attrs.get("email")
        username = attrs.get("username")
        password = attrs.get("password")

        errors = {}

        # Normalize email to lowercase
        if email:
            email = email.lower()
            attrs['email'] = email
            
            try:
                custom_email_validation(email)
            except serializers.ValidationError as e:
                errors['email'] = e.detail
        
        if not password:
            errors["password"] = "Password is required."

        if errors:
            raise serializers.ValidationError(errors)
        
        try:
            # Use default validation (authenticate + token creation)
            data = super().validate(attrs)
        except AuthenticationFailed:
            errors["error"] = "Invalid username, email or password."
            raise AuthenticationFailed(errors)

        data = super().validate(attrs)

        user_serializer = CustomUserSerializer(self.user, context=self.context)
        data['user'] = user_serializer.data

        return data
    
    