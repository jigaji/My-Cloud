from django.contrib import admin
from django.utils.html import format_html
from api import models as api_models

class UserAdmin(admin.ModelAdmin):
    search_fields  = ['full_name', 'username', 'email']
    list_display  = ['username', 'email', 'password', 'full_name', 'is_superuser']

class ProfileAdmin(admin.ModelAdmin):
    search_fields  = ['user']
    list_display = ['thumbnail', 'user', 'full_name']

class FileAdmin(admin.ModelAdmin):
    list_display = ('uid', 'filename', 'upload_datetime', 'by_user', 'file','share_link')
    readonly_fields = ('share_link', 'size', )
    
    def get_original_file(self, obj):
        return format_html("<a href='%s' target='_blank'><button type='button'>download</button></a>" % (obj.share_link,))

    get_original_file.short_description = 'original_file'

admin.site.register(api_models.User, UserAdmin)
admin.site.register(api_models.Profile, ProfileAdmin)
admin.site.register(api_models.File, FileAdmin)