import os
import shutil
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_main.settings') 
django.setup()

from article.models import Article, Author


MEDIA_ROOT = os.path.join(os.getcwd(), 'media') 

def move_file(obj, field_name, new_path_func):
    file_field = getattr(obj, field_name)
    if not file_field:
        return
    old_path = os.path.join(MEDIA_ROOT, file_field.name)
    new_rel_path = new_path_func(obj, os.path.basename(file_field.name))
    new_full_path = os.path.join(MEDIA_ROOT, new_rel_path)

    if not os.path.exists(old_path):
        print(f"File does not exist: {old_path}")
        return

    os.makedirs(os.path.dirname(new_full_path), exist_ok=True)
    shutil.move(old_path, new_full_path)
    setattr(obj, field_name, new_rel_path)
    obj.save()
    print(f"Moved {old_path} -> {new_full_path}")


# Move authors photos
for author in Author.objects.all():
    move_file(author, 'picture', lambda obj, filename: f'images/article/author/{obj.name}/{filename}')

# Move articles photos
for article in Article.objects.all():
    for field_name in ['first_media', 'second_media', 'third_media']:
        def get_path(obj, filename):
            ext = os.path.splitext(filename)[1].lower()
            if ext in ['.jpg', '.jpeg', '.png', '.gif', '.webp']:
                folder = 'images'
            elif ext in ['.mp4', '.webm', '.ogg', '.mov', '.avi']:
                folder = 'videos'
            else:
                folder = 'files'
            return f'{folder}/article/article/{obj.slug}/{filename}'

        move_file(article, field_name, get_path)



