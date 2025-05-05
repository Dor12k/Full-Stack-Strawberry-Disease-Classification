
# File name: permissions.py

from rest_framework.permissions import BasePermission

class IsOwner(BasePermission):
    """
    Allow actions only if the object is the logged-in user.
    """

    def has_object_permission(self, request, view, obj):
        return obj == request.user


