
# File name: test_user_update.py

import pytest
from django.urls import reverse
from rest_framework import status

@pytest.mark.django_db
def test_user_update_password(client, valid_user_data):
    # Create a user
    url = reverse('customuser-list')
    create_response = client.post(url, valid_user_data)
    user_id = create_response.data['id']  # Get user ID from creation response

    # Log in as the user to get the token (assuming JWT)
    login_data = {'email': valid_user_data['email'], 'password': valid_user_data['password']}
    login_url = reverse('token_obtain_pair')  # Change this if necessary
    login_response = client.post(login_url, login_data)
    token = login_response.data["access"]

    # Update password with correct old password
    update_data = {
        "new_password": "NewStrongPassword123*",
        "password": "StrongPassword123*"  # Old password for verification
    }

    user_url = reverse('customuser-detail', args=[user_id])
    
    # Add the Authorization header with the token
    response = client.patch(user_url, update_data, HTTP_AUTHORIZATION=f'Bearer {token}')

    # Check the response status
    assert response.status_code == status.HTTP_200_OK

@pytest.mark.django_db
def test_user_update_wrong_password(client, valid_user_data):
    # Create a user
    url = reverse('customuser-list')
    create_response = client.post(url, valid_user_data)
    user_id = create_response.data['id']  # Get user ID from creation response

    # Log in as the user to get the token (assuming JWT)
    login_data = {'email': valid_user_data['email'], 'password': valid_user_data['password']}
    login_url = reverse('token_obtain_pair')  # Change this if necessary
    login_response = client.post(login_url, login_data)
    token = login_response.data["access"]

    # Attempt to update password with an incorrect old password
    update_data = {
        "new_password": "NewStrongPassword123*",
        "password": "WrongPassword123*"  # Incorrect password
    }

    user_url = reverse('customuser-detail', args=[user_id])
    
    # Add the Authorization header with the token
    response = client.patch(user_url, update_data, HTTP_AUTHORIZATION=f'Bearer {token}')

    # Check the response status
    assert response.status_code == status.HTTP_400_BAD_REQUEST

@pytest.mark.django_db
def test_user_update_name(auth_client, create_user):
    user_url = reverse('customuser-detail', args=[create_user.id])

    update_data = {
        "first_name": "John",
        "last_name": "Doe",
        "password": "StrongPassword123*"  
    }

    response = auth_client.patch(user_url, update_data)

    assert response.status_code == status.HTTP_200_OK
    assert response.data["first_name"] == "John"
    assert response.data["last_name"] == "Doe"

@pytest.mark.django_db
def test_user_update_missing_password(client, valid_user_data):
    # Create a user
    url = reverse('customuser-list')
    create_response = client.post(url, valid_user_data)
    user_id = create_response.data['id']  # Get user ID from creation response

    # Log in as the user to get the token
    login_data = {'email': valid_user_data['email'], 'password': valid_user_data['password']}
    login_url = reverse('token_obtain_pair') 
    login_response = client.post(login_url, login_data)
    token = login_response.data["access"]

    # Attempt to update without providing a password
    update_data = {
        "first_name": "John",  # Provided name, but missing password
        "last_name": "Doe"
    }

    user_url = reverse('customuser-detail', args=[user_id])
    
    # Add the Authorization header with the token
    response = client.patch(user_url, update_data, HTTP_AUTHORIZATION=f'Bearer {token}')

    # Check that response indicates missing password
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "password" in response.data

@pytest.mark.django_db
def test_user_update_username(client, valid_user_data):
    """Test user update with a valid username."""
    url = reverse('customuser-list')
    create_response = client.post(url, valid_user_data)
    user_id = create_response.data["id"]

    # Log in as the user to get the token
    login_data = {'email': valid_user_data['email'], 'password': valid_user_data['password']}
    login_url = reverse('token_obtain_pair')
    login_response = client.post(login_url, login_data)
    token = login_response.data["access"]

    # Update the username
    update_data = {
        "username": "new_username",  # New valid username
        "password": valid_user_data["password"]  # Existing password for verification
    }

    user_url = reverse('customuser-detail', args=[user_id])
    response = client.patch(user_url, update_data, HTTP_AUTHORIZATION=f'Bearer {token}')

    # Check the response status and that the username is updated
    assert response.status_code == status.HTTP_200_OK
    assert response.data["username"] == "new_username"

@pytest.mark.django_db
def test_user_update_username_exists(client, valid_user_data):
    """Test user update with a username that already exists."""
    
    url = reverse('customuser-list')
    create_response = client.post(url, valid_user_data)
    user_id = create_response.data["id"]

    # Create another user to test the conflict
    another_user_data = valid_user_data.copy()
    another_user_data["username"] = "anotheruser"
    another_user_data["email"] = "anotheruser@example.com"
    create_response_2 = client.post(url, another_user_data)

    # Log in as the first user to get the token
    login_data = {'email': valid_user_data['email'], 'password': valid_user_data['password']}
    login_url = reverse('token_obtain_pair')
    login_response = client.post(login_url, login_data)
    token = login_response.data["access"]

    # Attempt to update the first user's username to the second user's username
    update_data = {
        "username": another_user_data["username"],  # Same username as another user
        "password": valid_user_data["password"]
    }

    user_url = reverse('customuser-detail', args=[user_id])
    response = client.patch(user_url, update_data, HTTP_AUTHORIZATION=f'Bearer {token}')

    # Check that the response indicates a conflict
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "username" in response.data
    assert "Username already exists." in response.data["username"]

@pytest.mark.django_db
def test_user_update_invalid_email(client, valid_user_data):
    """Test user update with an invalid email address."""
    url = reverse('customuser-list')
    create_response = client.post(url, valid_user_data)
    user_id = create_response.data["id"]

    # Log in as the user to get the token
    login_data = {'email': valid_user_data['email'], 'password': valid_user_data['password']}
    login_url = reverse('token_obtain_pair')
    login_response = client.post(login_url, login_data)
    token = login_response.data["access"]

    # Attempt to update to an invalid email
    update_data = {
        "email": "invalid-email",  # Invalid email
        "password": valid_user_data["password"]
    }

    user_url = reverse('customuser-detail', args=[user_id])
    response = client.patch(user_url, update_data, HTTP_AUTHORIZATION=f'Bearer {token}')

    # Check that the response indicates a validation error for the email
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "email" in response.data
    assert "Enter a valid email address." in str(response.data)

@pytest.mark.django_db
def test_user_update_missing_password(client, valid_user_data):
    """Test user update without providing a password."""
    url = reverse('customuser-list')
    create_response = client.post(url, valid_user_data)
    user_id = create_response.data['id']

    # Log in as the user to get the token
    login_data = {'email': valid_user_data['email'], 'password': valid_user_data['password']}
    login_url = reverse('token_obtain_pair')
    login_response = client.post(login_url, login_data)
    token = login_response.data["access"]

    # Attempt to update user data without password (should fail)
    update_data = {
        "first_name": "John",  # Provided name
        "last_name": "Doe"  # Provided last name
    }

    user_url = reverse('customuser-detail', args=[user_id])
    response = client.patch(user_url, update_data, HTTP_AUTHORIZATION=f'Bearer {token}')

    # Check that the response indicates missing password
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "password" in response.data
