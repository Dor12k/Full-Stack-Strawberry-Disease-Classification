
# classification/models.py
import os
from django.db import models
from django.utils.text import slugify



# Upload image in path with disease name
def disease_image_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    disease_name = slugify(instance.disease.name)
    filename = f"{slugify(os.path.splitext(filename)[0])}.{ext}"
    return f"images/classification/diseases_images/{disease_name}/{filename}"


class Disease(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=20, default='leaf')

    def __str__(self):
        return self.name


class DiseaseImage(models.Model):
        
    disease = models.ForeignKey(Disease, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to=disease_image_upload_path)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.disease.name}"



