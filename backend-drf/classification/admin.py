
# File name: classification/admin.py
from django.contrib import admin
from .models import Disease, DiseaseImage



# Register your models here.
class DiseaseImageInline(admin.TabularInline):
    model = DiseaseImage
    extra = 1  


@admin.register(Disease)
class DiseaseAdmin(admin.ModelAdmin):
    list_display = ('id', 'name',)
    search_fields = ('name',)
    inlines = [DiseaseImageInline]


@admin.register(DiseaseImage)
class DiseaseImageAdmin(admin.ModelAdmin):
    list_display = ('disease', 'image', 'uploaded_at')
    list_filter = ('disease',)
