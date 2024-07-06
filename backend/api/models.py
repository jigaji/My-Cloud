from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from django.utils.html import mark_safe
from django.utils import timezone
from django.dispatch import receiver
from django.conf import settings
import os
import uuid 
import math
import logging
import random
import string
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

class User(AbstractUser):
    username = models.CharField(unique=True, max_length=100)
    email = models.EmailField(unique=True) 
    full_name = models.CharField(max_length=100, null=True, blank=True)
    is_superuser = models.BooleanField(default=False)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email
    
    def save(self, *args, **kwargs):
        email_username, mobile = self.email.split("@")
        if self.full_name == "" or self.full_name == None:
            self.full_name = email_username
        if self.username == "" or self.username == None:
            self.username = email_username  
    
        super(User, self).save(*args, **kwargs)


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.FileField(upload_to="image", default="default/default-user.jpg", null=True, blank=True)
    full_name = models.CharField(max_length=100, null=True, blank=True)


    def __str__(self):
        if self.full_name:
            return str(self.full_name)
        else:
            return str(self.user.full_name)
    

    def save(self, *args, **kwargs):
        if self.full_name == "" or self.full_name == None:
            self.full_name = self.user.full_name
        super(Profile, self).save(*args, **kwargs)

    def thumbnail(self):
        return mark_safe('<img src="/media/%s" width="50" height="50" object-fit:"cover" style="border-radius: 30px; object-fit: cover;" />' % (self.image))
    

def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

post_save.connect(create_user_profile, sender=User)
post_save.connect(save_user_profile, sender=User)



def check_unique_filename(name):
    print('check', name)
    if File.objects.filter(filename=name).exists():
        filename = get_available_name(name)
        print('un', filename )
    else:
        filename = name
    return filename
    

def get_available_name(name):
    print('uniq')
    file_root, file_ext = os.path.splitext(name)
    print('root',file_root)
    print('ext',file_ext)
    ran = ''.join(random.choices(string.ascii_letters + string.digits, k = 10))  
    filename = f'{file_root}_{ran}{file_ext}'
    return filename

def convert_size(size_bytes):
    size_name = ('B', 'KB', 'MB', 'GB')
    i = int(math.floor(math.log(size_bytes, 1024)))
    s = round(size_bytes / math.pow(1024, i), 2)
    return f'{s} {size_name[i]}'


class File(models.Model):
    uid = models.UUIDField(editable=True, default=uuid.uuid4, unique=True)
    file = models.FileField(null=True, verbose_name='file in storage')
    filename = models.CharField(max_length=255, null=True, default='')
    comment = models.CharField(max_length=500, null=True, default='')
    size = models.CharField(max_length=255, null=True)
    share_link = models.CharField(max_length=255, null=True)
    upload_datetime = models.DateTimeField(default=timezone.now)
    by_user = models.ForeignKey(User, on_delete=models.CASCADE, default=1)

    def save(self, *args, **kwargs):

        userfolder = self.by_user.username
        hash_link = hash(self.upload_datetime)
        print('hash', hash_link)

        if self.id:
            logger.info(f"Update file with id='{self.id}' and filename='{self.filename}' was initialized by {self.by_user}.")
            old_full_filepath = self.file.path
            new_full_filepath = os.path.join(settings.MEDIA_ROOT, userfolder, self.filename)
            self.file.name = os.path.join(userfolder, self.filename)
            os.rename(old_full_filepath, new_full_filepath)
        else:
            file_root, file_ext = os.path.splitext(self.file.name)

            if self.filename:
                self.filename = check_unique_filename(self.filename)
                self.file.name = os.path.join(userfolder, self.filename)
            else:
                self.filename = self.file.name
                self.file.name = os.path.join(userfolder, f'{hash_link}{file_ext}')

            self.share_link = os.path.join(os.getenv('REACT_APP_API_URL'),'share', f'{self.uid}')
            self.size = convert_size(self.file.size)
          

        super().save(*args, **kwargs)

    def __str__(self):
        return str(self.file.name)


@receiver(models.signals.post_delete, sender=File)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    if instance.file and os.path.isfile(instance.file.path):
        os.remove(instance.file.path)