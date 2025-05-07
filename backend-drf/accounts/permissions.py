
# File name: permissions.py

from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsOwner(BasePermission):
    """
    Only allow the user to access or modify their own object.
    """

    def has_object_permission(self, request, view, obj):
        return obj == request.user


