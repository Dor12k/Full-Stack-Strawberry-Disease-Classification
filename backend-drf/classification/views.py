


# classification/views.py
from rest_framework import viewsets
from django.shortcuts import render
from .models import Disease, DiseaseImage
from .serializers import DiseaseSerializer, DiseaseImageSerializer
from rest_framework.parsers import MultiPartParser, FormParser



class DiseaseViewSet(viewsets.ModelViewSet):
    
    queryset = Disease.objects.all()
    serializer_class = DiseaseSerializer
    parser_classes = (MultiPartParser, FormParser)


class DiseaseImageViewSet(viewsets.ModelViewSet):
    queryset = DiseaseImage.objects.all()
    serializer_class = DiseaseImageSerializer
    parser_classes = (MultiPartParser, FormParser)     






