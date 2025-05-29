

# accounts/tests/unit/test_serializers.py
import re
import os
import pytest
import tempfile
from accounts.models import CustomUser
from rest_framework import serializers
from accounts.serializers import CustomUserSerializer
from rest_framework.exceptions import ValidationError
from rest_framework.exceptions import AuthenticationFailed
from django.core.files.uploadedfile import SimpleUploadedFile
from accounts.serializers import CustomTokenObtainPairSerializer

# Check if we're running in a CI environment
IS_CI = os.getenv('CI') == 'true'

@pytest.mark.django_db
def test_create_user_successfully(valid_user_data):
    serializer = CustomUserSerializer(data=valid_user_data)
    assert serializer.is_valid(), serializer.errors

    user = serializer.save()

    assert user.username == valid_user_data["username"]
    assert user.email == valid_user_data["email"]
    assert user.check_password(valid_user_data["password"])

@pytest.mark.django_db
def test_create_user_with_existing_email(valid_user_data):

    CustomUser.objects.create_user(
        username='someotheruser',
        email=valid_user_data['email'],
        password='SomePassword123*'
    )
    
    serializer = CustomUserSerializer(data=valid_user_data)

    with pytest.raises(serializers.ValidationError):
        serializer.create(valid_user_data) 

@pytest.mark.django_db
def test_create_user_with_existing_username(valid_user_data):
    CustomUser.objects.create_user(
        username=valid_user_data['username'],
        email='existinguser@example.com',
        password='SomePassword123*'
    )

    serializer = CustomUserSerializer(data=valid_user_data)
    with pytest.raises(serializers.ValidationError):
        serializer.create(valid_user_data) 

@pytest.mark.django_db
@pytest.mark.parametrize("invalid_username", ["", "   "])
def test_create_user_with_invalid_username(valid_user_data, invalid_username):
    # Inject invalid username into valid data
    invalid_data = valid_user_data.copy()
    invalid_data["username"] = invalid_username

    serializer = CustomUserSerializer(data=invalid_data)

    with pytest.raises(serializers.ValidationError):
        serializer.create(invalid_data) 

@pytest.mark.django_db
def test_create_user_with_invalid_email(valid_user_data):
    invalid_data = valid_user_data.copy()
    invalid_data['email'] = 'invalidemail.com'  # No @ symbol
    serializer = CustomUserSerializer(data=invalid_data)
    with pytest.raises(ValidationError):
        serializer.is_valid(raise_exception=True)

@pytest.mark.django_db
def test_create_user_with_invalid_password(valid_user_data):
    invalid_data = valid_user_data.copy()
    invalid_data['password'] = 'short'
    serializer = CustomUserSerializer(data=invalid_data)
    with pytest.raises(serializers.ValidationError):
        serializer.is_valid(raise_exception=True)

@pytest.mark.django_db
def test_create_user_with_empty_fields(valid_user_data):
    invalid_data = valid_user_data.copy()
    invalid_data['email'] = ''  # Empty email
    serializer = CustomUserSerializer(data=invalid_data)

    with pytest.raises(serializers.ValidationError):
        serializer.create(invalid_data)

@pytest.mark.django_db
def test_create_user_with_profile_picture(valid_user_data):
    
    # Use relative path if in CI, else use absolute path for local development
    image_filename = 'Panda-icon_3U9dSB8.png'
    if IS_CI:
        image_path = os.path.join(os.path.dirname(__file__), '..', 'assets', image_filename)
    else:
        image_path = os.path.abspath(
            os.path.join(os.path.dirname(__file__), '../assets', image_filename)
        )
        
    # Create a temporary image file in write and read mode
    with tempfile.NamedTemporaryFile(suffix=".jpg", mode='wb+', delete=False) as img:
        # Open a valid JPEG image file from disk and write it to the temp file
        with open(image_path, "rb") as img_file:
            img.write(img_file.read())
        img.seek(0)  # Reset the file pointer to the beginning for reading

        # Create a SimpleUploadedFile from the temporary image
        valid_user_data['profile_picture'] = SimpleUploadedFile(
            name="profile_picture.jpg",
            content=img.read(),
            content_type='image/jpeg'
        )

    # Create the serializer with the complete user data including image
    serializer = CustomUserSerializer(data=valid_user_data)

    # Validate the serializer
    assert serializer.is_valid(), f"Errors: {serializer.errors}"

    # Clean up the temporary file
    os.remove(img.name)

@pytest.mark.django_db
def test_token_obtain_with_valid_credentials(valid_user_data):
    user = CustomUser.objects.create_user(**valid_user_data)
    serializer = CustomTokenObtainPairSerializer(data={'email': valid_user_data['email'], 'password': valid_user_data['password']})
    assert serializer.is_valid()
    assert 'access' in serializer.validated_data

@pytest.mark.django_db
def test_token_obtain_with_invalid_email(valid_user_data):
    invalid_data = valid_user_data.copy()
    invalid_data['email'] = 'invalid*@example.com'
    serializer = CustomTokenObtainPairSerializer(data=invalid_data)
    with pytest.raises(ValidationError):
        serializer.is_valid(raise_exception=True)

@pytest.mark.django_db
def test_token_obtain_with_invalid_password(valid_user_data):

    user = CustomUser.objects.create_user(**valid_user_data)
    invalid_data = valid_user_data.copy()
    invalid_data['password'] = 'wrongpassword'
    serializer = CustomTokenObtainPairSerializer(data=invalid_data)
    with pytest.raises(AuthenticationFailed):
        serializer.is_valid(raise_exception=True)

@pytest.mark.django_db
def test_update_user_with_invalid_email(valid_user_data):
    user = CustomUser.objects.create_user(**valid_user_data)
    invalid_data = {'email': 'invalidemail.com'}  # Invalid email format
    serializer = CustomUserSerializer(user, data=invalid_data, partial=True)
    with pytest.raises(ValidationError):
        serializer.is_valid(raise_exception=True)

@pytest.mark.django_db
def test_update_user_with_valid_password(valid_user_data):

    # Create a user with valid data
    user = CustomUser.objects.create_user(**valid_user_data)

    # Update the user with the correct current password
    updated_data = {
        'password': 'StrongPassword123*',
        'new_password': 'NewValidPassword123*'}

    # Create a new serializer instance to update the user
    serializer = CustomUserSerializer(user, data=updated_data, partial=True)

    # Ensure the serializer is valid
    assert serializer.is_valid()

    # Save the updated user
    user = serializer.save()

    # Check that the password was updated successfully
    assert user.check_password('NewValidPassword123*')

@pytest.mark.django_db
def test_update_user_with_valid_fields(valid_user_data):
    user = CustomUser.objects.create_user(**valid_user_data)

    updated_data = {
        'first_name': 'UpdatedFirst',
        'last_name': 'UpdatedLast',
        'email': 'updated_email@example.com',
        'password': 'StrongPassword123*',
    }

    serializer = CustomUserSerializer(user, data=updated_data, partial=True)
    assert serializer.is_valid(), serializer.errors
    user = serializer.save()

    assert user.first_name == 'UpdatedFirst'
    assert user.last_name == 'UpdatedLast'
    assert user.email == 'updated_email@example.com'

@pytest.mark.django_db
def test_update_user_with_new_email(valid_user_data):
    user = CustomUser.objects.create_user(**valid_user_data)

    new_email = 'newemail@example.com'
    updated_data = {
        'email': new_email,
        'password': 'StrongPassword123*',
    }

    serializer = CustomUserSerializer(user, data=updated_data, partial=True)
    assert serializer.is_valid(), serializer.errors
    user = serializer.save()

    # Check that the email was updated successfully
    assert user.email == new_email

@pytest.mark.django_db
def test_update_user_with_empty_fields(valid_user_data):
    user = CustomUser.objects.create_user(**valid_user_data)

    updated_data = {
        'email': '',
        'password': 'StrongPassword123*',
    }

    serializer = CustomUserSerializer(user, data=updated_data, partial=True)
    with pytest.raises(serializers.ValidationError):
        serializer.is_valid(raise_exception=True)

@pytest.mark.django_db
def test_update_user_with_profile_picture(valid_user_data):
    user = CustomUser.objects.create_user(**valid_user_data)

    # Use relative path if in CI, else use absolute path for local development
    image_filename = 'Panda-icon_3U9dSB8.png'
    if IS_CI:
        image_path = os.path.join(os.path.dirname(__file__), '..', 'assets', image_filename)
    else:
        image_path = os.path.abspath(
            os.path.join(os.path.dirname(__file__), '../assets', image_filename)
        )
        
    # Create a temporary image file in write and read mode
    with tempfile.NamedTemporaryFile(suffix=".jpg", mode='wb+', delete=False) as img:
        with open(image_path, "rb") as img_file:
            img.write(img_file.read())
        img.seek(0)

        updated_data = {
            'profile_picture': SimpleUploadedFile(
                name="profile_picture.jpg",
                content=img.read(),
                content_type='image/jpeg'
            ),
            'password': 'StrongPassword123*',
        }

    serializer = CustomUserSerializer(user, data=updated_data, partial=True)
    assert serializer.is_valid(), serializer.errors
    user = serializer.save()

    # Check that the profile picture is updated
    pattern = rf"^media/images/accounts/{user.username}/profile_picture/profile_picture(_[a-zA-Z0-9]+)?\.jpg$"
    assert re.match(pattern, user.profile_picture.name)
    
    # Clean up the temporary file
    os.remove(img.name)
