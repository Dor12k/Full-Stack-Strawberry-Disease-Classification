
# File name: test_user_creation

import pytest
from django.urls import reverse
from rest_framework import status
from ...models import CustomUser

# Used to clean the database before each test
@pytest.fixture(autouse=True)
def clear_user_data():
    """Ensure the user data is cleaned up before each test."""
    CustomUser.objects.all().delete()
    
# Using fixtures defined in conftest.py
@pytest.mark.django_db
def test_user_creation_valid_data(client, valid_user_data):
    """Test that a user is created successfully with valid data."""
    url = reverse('customuser-list')
    response = client.post(url, valid_user_data)
    
    assert response.status_code == status.HTTP_201_CREATED
    assert "id" in response.data
    assert response.data["username"] == valid_user_data["username"]
    assert response.data["email"] == valid_user_data["email"]
    # Optionally, verify user is saved in database
    user = CustomUser.objects.get(id=response.data["id"])
    assert user.username == valid_user_data["username"]

@pytest.mark.django_db
def test_create_user_valid_password(client, valid_user_data):
    """Test that a user is created with a valid password."""
    url = reverse('customuser-list')
    data = valid_user_data.copy()  # Use data from fixture
    response = client.post(url, data)

    assert response.status_code == status.HTTP_201_CREATED
    assert "id" in response.data

@pytest.mark.django_db(transaction=True)
def test_create_user_email_already_exists(client, valid_user_data):
    """Test that an error occurs when trying to create a user with an existing email."""
    url = reverse('customuser-list')

    # First, create a user to trigger the email conflict
    response = client.post(url, valid_user_data)  # Create the first user
    assert response.status_code == status.HTTP_201_CREATED  # Ensure first user is created

    # Try to create a new user with the same email
    new_data = valid_user_data.copy()
    new_data["username"] = "newuser2"  # Ensure username is unique
    new_data["email"] = valid_user_data["email"]  # Same email
    response = client.post(url, new_data)

    # Assert that the response is an error due to duplicate email
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "Email already exists." in str(response.data)  # Changed check to look for the error message in response.data

@pytest.mark.django_db(transaction=True)
def test_create_user_username_already_exists(client, valid_user_data):
    """Test that an error occurs when trying to create a user with an existing username."""
    url = reverse('customuser-list')

    # Create the first user
    response = client.post(url, valid_user_data)
    assert response.status_code == status.HTTP_201_CREATED

    # Force evaluation of queryset so DB sees the new user
    list(CustomUser.objects.all())

    # Try to create a new user with same username
    new_data = valid_user_data.copy()
    new_data["username"] = valid_user_data["username"]
    new_data["email"] = "newemail@example.com"
    response = client.post(url, new_data)

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "Username already exists." in str(response.data)

@pytest.mark.django_db
def test_create_user_missing_password(client, valid_user_data):
    """Test that an error occurs when the password is missing."""
    url = reverse('customuser-list')
    data = valid_user_data.copy()
    data.pop('password')  # Remove password

    response = client.post(url, data)

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "This field is required." in response.data['password']

@pytest.mark.django_db
def test_create_user_missing_email(client, valid_user_data):
    """Test that an error occurs when the email is missing."""
    url = reverse('customuser-list')
    data = valid_user_data.copy()
    data.pop('email')  # Remove email

    response = client.post(url, data)

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "email" in response.data

# Test for email login and password
@pytest.mark.django_db
def test_login_with_email_and_password(client, valid_user_data):
    """Test that a user can log in with email and password."""
    url = reverse('token_obtain_pair')
    client.post(reverse('customuser-list'), valid_user_data)  # Create user

    login_data = {
        "email": valid_user_data["email"],
        "password": valid_user_data["password"]
    }

    response = client.post(url, login_data)

    assert response.status_code == status.HTTP_200_OK
    assert "access" in response.data
    assert "refresh" in response.data



