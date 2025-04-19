
# File name: test.views.py

import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

@pytest.mark.django_db
def test_create_user_view(client, valid_user_data):
    url = reverse('customuser-list')  # API endpoint for creating user
    data = valid_user_data  # Use the fixture for valid user data

    # Send request to create user
    response = client.post(url, data)

    # Ensure that the user was created successfully with status code 201
    assert response.status_code == status.HTTP_201_CREATED
    assert "id" in response.data  # If the user ID appears in the response, it means the user was created successfully


@pytest.mark.django_db
def test_create_user_without_email(client):
    url = reverse('customuser-list')
    data = {
        "username": "newuser",
        "password": "StrongPassword123*"
    }

    # Send request to create user without email
    response = client.post(url, data)

    # Ensure the error is code 400 with a message about missing email
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "email" in response.data  # Email field cannot be empty


@pytest.mark.django_db
def test_user_detail_view(auth_client, create_user):
    # Create an initial user
    user_url = reverse('customuser-detail', args=[create_user.id])

    response = auth_client.get(user_url)
    
    # Ensure the response contains user details
    assert response.status_code == status.HTTP_200_OK
    assert response.data['email'] == create_user.email


@pytest.mark.django_db
def test_update_user_view(auth_client, create_user):

    # Create an initial user
    user_url = reverse('customuser-detail', args=[create_user.id])

    # Update user's password
    update_data = {
        'username': 'updateduser',
        'email': 'updated@example.com',
        'password': 'StrongPassword123*',
        'first_name': 'Updated',
        'last_name': 'User',
    }

    response = auth_client.put(user_url, data=update_data)

    # Ensure the password was updated successfully
    assert response.status_code == status.HTTP_200_OK

    # If you don't want to expose passwords, you can ensure the response does not contain the password
    assert "password" not in response.data


@pytest.mark.django_db
def test_delete_user_view(auth_client, create_user):

    # Create an initial user
    user_url = reverse('customuser-detail', args=[create_user.id])

    # Delete the user    
    response = auth_client.delete(user_url)

    # Ensure the user was deleted successfully
    assert response.status_code == status.HTTP_204_NO_CONTENT

