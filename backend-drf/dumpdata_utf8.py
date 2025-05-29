import os
import django
from django.core.management import call_command

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_main.settings')  # תתאים את זה לשם המודול שלך

django.setup()

with open('full_data.json', 'w', encoding='utf-8') as f:
    call_command('dumpdata',
                 '--natural-foreign',
                 '--natural-primary',
                 '--exclude=contenttypes',
                 '--exclude=auth.Permission',
                 indent=2,
                 stdout=f)
