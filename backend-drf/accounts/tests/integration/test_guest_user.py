
import pytest
from django.urls import reverse
from rest_framework import status
from accounts.models import CustomUser


@pytest.mark.django_db
def test_guest_user_can_login(client):
    url = reverse('guest-login')
    response = client.post(url)

    assert response.status_code == 200
    assert 'access' in response.data
    assert 'refresh' in response.data

    # Optional: check guest was created
    guest_email = "guest@example.com"
    assert CustomUser.objects.filter(email=guest_email).exists()


@pytest.mark.django_db
def test_guest_user_can_access_protected_view(client):
    # Get guest token
    url = reverse('guest-login')
    token_response = client.post(url)
    access_token = token_response.data['access']

    # Use token to access protected view
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
    response = client.get('/api/v1/protected-view/')

    assert response.status_code == 200
    assert response.data['status'] == 'Request was permitted'


@pytest.mark.django_db
def test_guest_user_cannot_update_profile(client):
    # Login as guest
    token_response = client.post(reverse('guest-login'))
    token = token_response.data['access']
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    # Get guest user ID
    user = CustomUser.objects.get(email="guest@example.com")
    update_url = f'/api/v1/users/{user.id}/'

    response = client.patch(update_url, data={'first_name': 'NewName'})
    assert response.status_code == 403
    assert response.data['error'] == 'Guest users cannot update their profile.'


@pytest.mark.django_db
def test_guest_user_cannot_delete_profile(client):
    # Login as guest
    token_response = client.post(reverse('guest-login'))
    token = token_response.data['access']
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    # Get guest user ID
    user = CustomUser.objects.get(email="guest@example.com")
    delete_url = f'/api/v1/users/{user.id}/'

    response = client.delete(delete_url)
    assert response.status_code == 403
    assert response.data['error'] == 'Guest users cannot delete their account.'
