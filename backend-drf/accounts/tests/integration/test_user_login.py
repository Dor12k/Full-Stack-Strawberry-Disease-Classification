
import pytest
from django.urls import reverse
from rest_framework import status
from ...models import CustomUser

@pytest.fixture
def create_user(valid_user_data):
    """Fixture to create a user for login testing."""
    user = CustomUser.objects.create_user(**valid_user_data)
    return user

@pytest.mark.django_db
def test_login_with_valid_credentials(client, create_user, valid_user_data):
    """Test login with valid email and password."""
    url = reverse('token_obtain_pair')
    
    login_data = {
        "email": valid_user_data["email"],
        "password": valid_user_data["password"]
    }

    response = client.post(url, login_data)

    assert response.status_code == status.HTTP_200_OK
    assert "access" in response.data
    assert "refresh" in response.data

@pytest.mark.django_db
def test_login_with_invalid_email(client, create_user, valid_user_data):
    """Test login with invalid email."""
    url = reverse('token_obtain_pair')
    
    login_data = {
        "email": "wrongemail@example.com",  # Invalid email
        "password": valid_user_data["password"]
    }

    response = client.post(url, login_data)

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert "error" in response.data
    assert response.data["error"] == "Invalid username, email or password."

@pytest.mark.django_db
def test_login_with_invalid_password(client, create_user, valid_user_data):
    """Test login with invalid password."""
    url = reverse('token_obtain_pair')
    
    login_data = {
        "email": valid_user_data["email"],
        "password": "WrongPassword123*"  # Invalid password
    }

    response = client.post(url, login_data)

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert "error" in response.data
    assert response.data["error"] == "Invalid username, email or password."

@pytest.mark.django_db
def test_login_without_credentials(client):
    """Test login without any credentials."""
    url = reverse('token_obtain_pair')
    
    response = client.post(url, {})

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "email" in response.data
    assert "password" in response.data

