


# classification/views.py

from django.conf import settings
from .redis_client import redis_client

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Disease, DiseaseImage
from .serializers import DiseaseSerializer, DiseaseImageSerializer




class DiseaseViewSet(viewsets.ModelViewSet):
    
    queryset = Disease.objects.all()
    serializer_class = DiseaseSerializer
    parser_classes = (MultiPartParser, FormParser)


class DiseaseImageViewSet(viewsets.ModelViewSet):
    queryset = DiseaseImage.objects.all()
    serializer_class = DiseaseImageSerializer
    parser_classes = (MultiPartParser, FormParser)     

    @action(detail=False, methods=['get'], url_path='recent', permission_classes=[AllowAny])
    def recent_images(self, request):

        if not getattr(settings, 'ENABLE_RECENT_IMAGES_FEATURE', False):
            return Response({"message": "Recent images feature is disabled."}, status=403)

        if redis_client is None:
            return Response({"message": "Redis is not enabled."}, status=503)

    
        redis_key = "recent_disease_images"
        recent_images_data = redis_client.lrange(redis_key, 0, 9)

        recent_images = []
        for image_data in recent_images_data:
            if isinstance(image_data, bytes):
                image_data = image_data.decode('utf-8')
            image_id, disease_id = image_data.split(":")
            recent_images.append({
                "image_id": image_id,
                "disease_id": disease_id
            })

        return Response({"recent_images": recent_images}, status=200)




@api_view(['POST'])
def view_disease_image(request, image_id, disease_id):

    if not getattr(settings, 'ENABLE_RECENT_IMAGES_FEATURE', False):
        return Response({"message": "Recent images feature is disabled."}, status=403)

    if redis_client is None:
        return Response({"message": "Redis is not enabled."}, status=503)
    
    # Unique key for all users (not specific to any individual user)
    redis_key = "recent_disease_images"
    
    # Unique key to track seen images (to prevent duplicates)
    unique_images_key = "unique_images"

    # Create the data to store: image_id and disease_id
    image_data = f"{image_id}:{disease_id}"


    if redis_client.sadd(unique_images_key, image_id):  
        # Push the image data to the front of the list
        redis_client.lpush(redis_key, image_data)

        # Limit the list to the 10 most recent images only
        redis_client.ltrim(redis_key, 0, 9)  # Keeps the first 10 items in the list
        
        # Returning a success response
        return Response({"message": "Image added to recent list successfully!"}, status=200)
    else:
        # Image already exist
        return Response({"message": "Image has already been added."}, status=400)




