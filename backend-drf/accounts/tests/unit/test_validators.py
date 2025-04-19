


import pytest
from accounts.validators import (
    custom_email_validation,
    custom_username_validation,
    custom_password_validation,
)
from rest_framework.exceptions import ValidationError

pytestmark = pytest.mark.django_db

# ----------------------------
# Email Validation Tests
# ----------------------------

def test_email_cannot_be_empty():
    with pytest.raises(ValidationError) as exc_info:
        custom_email_validation('', target='create')
    assert exc_info.value.detail == ["Email cannot be empty."]

def test_email_cannot_contain_spaces():
    with pytest.raises(ValidationError) as exc_info:
        custom_email_validation('bad email@example.com', target='create')
    assert exc_info.value.detail == ["Email can't contain spaces."]

def test_email_cannot_contain_special_characters():
    with pytest.raises(ValidationError) as exc_info:
        custom_email_validation('bad!email@example.com', target='create')
    assert exc_info.value.detail == ["Email can't contain special characters."]

# ----------------------------
# Username Validation Tests
# ----------------------------

def test_username_cannot_be_empty():
    with pytest.raises(ValidationError) as exc_info:
        custom_username_validation('', target='create')
    assert exc_info.value.detail == ["Username cannot be empty."]

def test_username_cannot_contain_spaces():
    with pytest.raises(ValidationError) as exc_info:
        custom_username_validation('bad username', target='create')
    assert exc_info.value.detail == ["Username can't contain spaces."]

def test_username_cannot_contain_special_characters():
    with pytest.raises(ValidationError) as exc_info:
        custom_username_validation('bad$username', target='create')
    assert exc_info.value.detail == ["Username can't contain special characters."]

# ----------------------------
# Password Validation Tests
# ----------------------------

def test_password_requires_uppercase():
    with pytest.raises(ValidationError) as exc_info:
        custom_password_validation('lowercase1!', target='create')
    assert exc_info.value.detail == ["Password must contain at least one uppercase letter."]

def test_password_requires_number():
    with pytest.raises(ValidationError) as exc_info:
        custom_password_validation('NoNumber!', target='create')
    assert exc_info.value.detail == ["Password must contain at least one number."]

def test_password_requires_special_character():
    with pytest.raises(ValidationError) as exc_info:
        custom_password_validation('NoSpecial1', target='create')
    assert exc_info.value.detail == ["Password must contain at least one special character."]
