


# accounts/tests/unit/test_views.py

import pytest
from django.urls import reverse
from rest_framework import status
from accounts.models import CustomUser

@pytest.mark.django_db
class TestCustomTokenObtainPairView:

    @pytest.fixture(autouse=True)
    def setup(self, client):
        self.client = client
        self.url = reverse('token_obtain_pair')

    def test_empty_email_returns_custom_error(self):
        response = self.client.post(self.url, {"email": "", "password": "somepassword"})
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "email" in response.data
        assert response.data["email"] == ["Email cannot be empty."]

    def test_empty_password_returns_custom_error(self):
        response = self.client.post(self.url, {"email": "test@example.com", "password": ""})
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "password" in response.data
        assert response.data["password"] == ["Password cannot be empty."]

    def test_invalid_credentials_return_401(self, client):
        response = client.post(self.url, {
            "email": "wrong@example.com",
            "password": "wrongpassword"
        })
        assert response.status_code == status.HTTP_401_UNAUTHORIZED    
        assert "error" in response.data
        assert response.data["error"] == "Invalid username, email or password."

    def test_valid_credentials_return_tokens(self, client, create_user, valid_user_data):
        response = client.post(self.url, {
            "email": valid_user_data["email"],
            "password": valid_user_data["password"]
        })

        assert response.status_code == status.HTTP_200_OK
        assert "access" in response.data
        assert "refresh" in response.data

    def test_list_users_admin_access(self, auth_admin_client):
        response = auth_admin_client.get(reverse('customuser-list'))
        assert response.status_code == status.HTTP_200_OK

    def test_create_user_allowed_for_all(self, client, valid_user_data):
        response = client.post(reverse('customuser-list'), valid_user_data)
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["email"] == valid_user_data["email"]

    def test_retrieve_user_own_data(self, auth_client, create_user):
        response = auth_client.get(reverse('customuser-detail', args=[create_user.id]))
        assert response.status_code == status.HTTP_200_OK
        assert response.data["email"] == create_user.email

    def test_retrieve_user_other_data_forbidden(self, auth_client, create_user, valid_user_data):
        other_user = CustomUser.objects.create_user(
            username="otheruser",
            email="other@example.com",
            password="OtherStrongPassword123*",
            first_name="Other",
            last_name="User"
        )
        response = auth_client.get(reverse('customuser-detail', args=[other_user.id]))
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_update_user_own_data(self, auth_client, create_user):
        updated_data = {'first_name': 'UpdatedName', 'password': 'StrongPassword123*'}
        response = auth_client.patch(reverse('customuser-detail', args=[create_user.id]), updated_data)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data["first_name"] == 'UpdatedName'

    def test_update_user_other_data_forbidden(self, auth_client, create_user, valid_user_data):
        other_user = CustomUser.objects.create_user(
            username="otheruser",
            email="other@example.com",
            password="OtherStrongPassword123*",
            first_name="Other",
            last_name="User"
        )
        updated_data = {'first_name': 'UpdatedName', 'password': 'StrongPassword123*'}
        response = auth_client.patch(reverse('customuser-detail', args=[other_user.id]), updated_data)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_delete_user_own_account(self, auth_client, create_user):
        response = auth_client.delete(reverse('customuser-detail', args=[create_user.id]))
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not CustomUser.objects.filter(id=create_user.id).exists()

    def test_delete_user_other_account_forbidden(self, auth_client, create_user, valid_user_data):
        other_user = CustomUser.objects.create_user(
            username="otheruser",
            email="other@example.com",
            password="OtherStrongPassword123*",
            first_name="Other",
            last_name="User"
        )
        response = auth_client.delete(reverse('customuser-detail', args=[other_user.id]))
        assert response.status_code == status.HTTP_403_FORBIDDEN
