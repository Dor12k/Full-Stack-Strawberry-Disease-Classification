# Generated by Django 5.1.7 on 2025-05-03 20:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('classification', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='diseaseimage',
            name='category',
            field=models.CharField(default='leaf', max_length=20),
        ),
    ]
