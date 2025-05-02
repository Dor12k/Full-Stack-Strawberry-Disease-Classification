


import os
from django.core.files import File
from classification.models import Disease, DiseaseImage

# base_directory = "path"


def upload_disease_images(base_directory):
    for disease_folder in os.listdir(base_directory):
        disease_path = os.path.join(base_directory, disease_folder)

        if os.path.isdir(disease_path):
            disease, created = Disease.objects.get_or_create(name=disease_folder)

            for image_name in os.listdir(disease_path):
                image_path = os.path.join(disease_path, image_name)

                if os.path.isfile(image_path):
                    with open(image_path, 'rb') as f:
                        image_file = File(f, name=image_name)
                        DiseaseImage.objects.create(disease=disease, image=image_file)

                    print(f"Uploaded {image_name} for disease {disease.name}")



# Use it from python manage.py shell to run hte script
# from classification.scripts.upload_disease_images import upload_disease_images
# upload_disease_images('path')