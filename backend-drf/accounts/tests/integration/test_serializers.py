import pytest
from rest_framework.exceptions import ValidationError
from ...models import CustomUser
from ...serializers import CustomUserSerializer


# Test user serializer with valid data
@pytest.mark.django_db
def test_user_serializer_valid_data(valid_user_data):
    serializer = CustomUserSerializer(data=valid_user_data)
    assert serializer.is_valid()  # Check if the data is valid
    user = serializer.save()  # Create the user
    assert user.username == valid_user_data['username']
    assert user.email == valid_user_data['email']

# Test user serializer with invalid email
@pytest.mark.django_db
def test_user_serializer_invalid_email(invalid_user_data):
    serializer = CustomUserSerializer(data=invalid_user_data)
    assert not serializer.is_valid()  # Should not be valid
    assert 'email' in serializer.errors  # Should return an error for email

# Test user serializer with missing username
@pytest.mark.django_db
def test_user_serializer_missing_username(valid_user_data):
    data = valid_user_data.copy()
    del data['username']  # Remove username to test missing field
    
    serializer = CustomUserSerializer(data=data)
    assert not serializer.is_valid()  # Should not be valid
    assert 'username' in serializer.errors  # Should return an error for username

# Test user serializer with missing password
@pytest.mark.django_db
def test_user_serializer_missing_password(valid_user_data):
    data = valid_user_data.copy()
    del data['password']  # Remove password to test missing field
    
    serializer = CustomUserSerializer(data=data)
    assert not serializer.is_valid()  # Should not be valid
    assert 'password' in serializer.errors  # Should return an error for password

# Test creation and saving with serializer
@pytest.mark.django_db
def test_user_serializer_create_and_return(valid_user_data):
    serializer = CustomUserSerializer(data=valid_user_data)
    assert serializer.is_valid()
    user = serializer.save()
    
    # Check that the user is saved in the database
    saved_user = CustomUser.objects.get(username=valid_user_data['username'])
    assert saved_user.username == valid_user_data['username']
    assert saved_user.email == valid_user_data['email']
    
    # Ensure that the password is saved correctly (compare after hashing)
    assert user.check_password(valid_user_data['password'])  # Ensure the password is correct
