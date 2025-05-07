

# File name: conftest.py

import pytest
from django.urls import reverse
from ..models import CustomUser
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken


# Fixture for APIClient
@pytest.fixture
def client():
    """APIClient fixture for making HTTP requests in tests."""
    return APIClient()

# Fixture for creating a valid user
@pytest.fixture
def valid_user_data():
    """Fixture for creating valid user data."""
    return {
        'username': 'newuser',
        'email': 'newuser@example.com',
        'password': 'StrongPassword123*',
        'first_name': 'First',
        'last_name': 'Last',
    }

# Fixture for creating invalid user data
@pytest.fixture
def invalid_user_data():
    """Fixture for creating invalid user data."""
    return {
        'username': 'newuser',
        'email': 'invalidemail',  # Invalid email
        'password': 'short',      # Invalid password
        'first_name': 'First',
        'last_name': 'Last',
    }

# Fixture for creating a user in the database
@pytest.fixture
def create_user(valid_user_data):
    """Fixture for creating a user in the database."""
    user = CustomUser.objects.create_user(**valid_user_data)
    return user

# Fixture for generating JWT token for a user
@pytest.fixture
def generate_jwt_token(create_user):
    """Fixture for generating JWT token."""
    user = create_user
    refresh = RefreshToken.for_user(user)
    return str(refresh.access_token)

# Fixture for logging in and getting a JWT token
@pytest.fixture
def client_login(client, create_user):
    """Fixture for logging in and returning JWT token."""
    user_data = {
        'email': create_user.email,
        'password': create_user.password,
    }
    response = client.post('/api/token/', data=user_data)
    assert response.status_code == 200
    return response.data['access']

@pytest.fixture
def auth_client(client, create_user):
    """Fixture for an authenticated client with JWT token."""
    user_data = {
        'email': create_user.email,
        'password': 'StrongPassword123*', 
    }
    login_url = reverse('token_obtain_pair')
    login_response = client.post(login_url, user_data)
    token = login_response.data["access"]

    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    return client

@pytest.fixture
def admin_user_data():
    """Fixture for creating admin user data."""
    return {
        'username': 'adminuser',
        'email': 'adminuser@example.com',
        'password': 'AdminPassword123*',
        'first_name': 'Admin',
        'last_name': 'User',
        'is_staff': True, 
    }

@pytest.fixture
def create_admin_user(admin_user_data):
    """Fixture for creating an admin user in the database."""
    user = CustomUser.objects.create_user(**admin_user_data)
    return user

@pytest.fixture
def auth_admin_client(client, create_admin_user):
    """Fixture for an authenticated admin client with JWT token."""
    user_data = {
        'email': create_admin_user.email,
        'password': 'AdminPassword123*', 
    }
    login_url = reverse('token_obtain_pair')
    login_response = client.post(login_url, user_data)
    token = login_response.data["access"]

    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    return client