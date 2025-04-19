
# File name: test_user_endpoint.py


import pytest
from django.urls import reverse
from rest_framework import status
from django.contrib.auth import get_user_model

@pytest.mark.django_db
def test_create_user(client, valid_user_data):
    # Create a new user via API using the valid user data
    response = client.post('/api/v1/users/', valid_user_data)
    
    # Ensure the response status is 201 (created successfully)
    assert response.status_code == 201
    
    # Ensure the new user is created in the database
    User = get_user_model()
    user = User.objects.get(username=valid_user_data['username'])
    
    assert user.username == valid_user_data['username']
    assert user.email == valid_user_data['email']
    assert user.check_password(valid_user_data['password'])  # Verify password is correct

@pytest.mark.django_db
def test_create_user_valid_password(client, valid_user_data):
    url = reverse('customuser-list')
    data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "StrongPassword123*"
    }
    response = client.post(url, data)

    assert response.status_code == status.HTTP_201_CREATED
    assert "id" in response.data  # Check if the user ID is created successfully

@pytest.mark.django_db
def test_create_user_invalid_password(client, invalid_user_data):
    url = reverse('customuser-list')
    response = client.post(url, invalid_user_data)

    assert response.status_code == status.HTTP_400_BAD_REQUEST

@pytest.mark.django_db
def test_create_user_email_already_exists(client, valid_user_data):
    # Create an initial user
    url = reverse('customuser-list')
    client.post(url, valid_user_data)

    # Try to create a new user with the same email
    new_data = {
        "username": "newusertest",
        "email": "newuser@example.com",  # Same email
        "password": "AnotherStrongPassword123*"
    }
    response = client.post(url, new_data)

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "email" in response.data  # The email field should return an error

@pytest.mark.django_db
def test_create_user_username_already_exists(client, valid_user_data):
    # Create an initial user
    url = reverse('customuser-list')
    client.post(url, valid_user_data)

    # Try to create a new user with the same username
    new_data = {
        "username": "newuser",  # Username already exists
        "email": "new@example.com",
        "password": "AnotherStrongPassword123*"
    }
    response = client.post(url, new_data)

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "username" in response.data  # The username field should return an error

@pytest.mark.django_db
def test_create_user_missing_password(client, valid_user_data):
    url = reverse('customuser-list')
    data = {**valid_user_data}  # Copy valid data, remove password
    del data['password']

    response = client.post(url, data)

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "This field is required." in response.data['password']

@pytest.mark.django_db
def test_create_user_missing_email(client, valid_user_data):
    url = reverse('customuser-list')
    data = {**valid_user_data}  # Copy valid data, remove email
    del data['email']

    response = client.post(url, data)

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "email" in response.data  # The email field should return an error

@pytest.mark.django_db
def test_get_user_details(auth_client, create_user):
    user_url = reverse('customuser-detail', args=[create_user.id])
    response = auth_client.get(user_url)

    assert response.status_code == status.HTTP_200_OK

@pytest.mark.django_db
def test_update_user(auth_client, create_user):
    
    # Use the token from the client_login fixture
    user_url = reverse('customuser-detail', args=[create_user.id])

    update_data = {
        'username': 'updateduser',
        'email': 'updated@example.com',
        'password': 'StrongPassword123*',
        'first_name': 'Updated',
        'last_name': 'User',
    }

    response = auth_client.put(user_url, data=update_data)

    assert response.status_code == status.HTTP_200_OK

@pytest.mark.django_db
def test_delete_user(auth_client, create_user):
    
    # Use the token from the client_login fixture
    user_url = reverse('customuser-detail', args=[create_user.id])
    
    response = auth_client.delete(user_url)



    assert response.status_code == status.HTTP_204_NO_CONTENT
