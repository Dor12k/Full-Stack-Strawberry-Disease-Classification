

# classification/scripts/populate_diseases_from_folders.py
import os
from django.core.files import File
from classification.models import Disease, DiseaseImage

# Path for images
BASE_DIR = 'media/images/classification/diseases_images'

def create_disease_with_images(disease_name, description=''):
    # Create a new disease instance if it doesn't exist
    disease, created = Disease.objects.get_or_create(name=disease_name, defaults={'description': description})
    
    # The disease images folder
    folder = os.path.join(BASE_DIR, disease_name.lower().replace(' ', '-'))

    # If the folder doesn't exist, print a warning and move to the next one
    if not os.path.exists(folder):
        print(f"⚠ Folder for {disease_name} does not exist. Skipping...")
        return

    # Create images for each file in the folder
    for filename in os.listdir(folder):
        if filename.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
            path = os.path.join(folder, filename)
            with open(path, 'rb') as f:
                DiseaseImage.objects.create(disease=disease, image=File(f))
    
    print(f"✔ Created disease '{disease_name}' and added images.")

def run():
    # Iterate through all disease folders in the 'diseases_images' directory
    for disease_folder in os.listdir(BASE_DIR):
        disease_folder_path = os.path.join(BASE_DIR, disease_folder)
        
        # If it's a disease folder, create it with its images
        if os.path.isdir(disease_folder_path):
            disease_name = disease_folder.replace('-', ' ').title()  # Convert the slug to a human-readable name
            create_disease_with_images(disease_name)

if __name__ == "__main__":
    run()
