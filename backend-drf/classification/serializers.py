

# classification/serializers.py
from rest_framework import serializers
from .models import Disease, DiseaseImage


class DiseaseImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiseaseImage
        fields = ['id', 'image', 'uploaded_at']


class DiseaseSerializer(serializers.ModelSerializer):
    images = DiseaseImageSerializer(many=True, read_only=True)

    class Meta:
        model = Disease
        fields = ['id', 'name', 'description', 'images']
