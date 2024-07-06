from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.core.validators import RegexValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
import logging
from api import models as api_models

logger = logging.getLogger(__name__)

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
   
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['full_name'] = user.full_name
        token['email'] = user.email
        token['username'] = user.username
        token['isAdmin'] = user.is_superuser
        try:
            token['vendor_id'] = user.vendor.id
        except:
            token['vendor_id'] = 0
        return token


class RegisterSerializer(serializers.ModelSerializer):

    login_validator = RegexValidator(
        regex=r'^[a-zA-Z]{1}[a-z0-9]{3,20}$',
        message='Login should start with letter, consist of letters and numbers, 4-20 characters',)
   
    password_validator = RegexValidator(
        regex=r'^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,/])[A-Za-z\d@$!%*?&.,]{6,}$', 
        message='Password should be at least 6 characters and consist of one uppercase letter, one numeric digit, and one special character',)
    
    username = serializers.CharField(label="Login", required=True, validators=[login_validator])
    password = serializers.CharField(write_only=True, required=True, validators=[password_validator])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        
        model = api_models.User
        fields = ('full_name','username', 'email',  'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        user = api_models.User.objects.create(
            full_name=validated_data['full_name'],
            email=validated_data['email'],
            username = validated_data['username']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = api_models.User
        fields = '__all__'


class RestrictedUserSerializer(serializers.ModelSerializer):
    files = serializers.SerializerMethodField(source=api_models.File.objects.all())
    
    class Meta:
        model = api_models.User
        fields = ('id', 'username', 'files')
        
    def get_files(self, obj):
        user_files = api_models.File.objects.filter(by_user=obj)
        filenames = [file.filename for file in user_files if file.file]
        return filenames

class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = api_models.Profile
        fields = '__all__'

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['user'] = UserSerializer(instance.user).data
        return response


class FileSerializer(serializers.ModelSerializer):
    filename = serializers.CharField(max_length=255, default='')
    # description = serializers.CharField(max_length=255, default='')
    upload_datetime = serializers.SerializerMethodField()
    by_user = serializers.PrimaryKeyRelatedField(queryset=api_models.User.objects.all())
    size = serializers.SerializerMethodField()
    share_link = serializers.SerializerMethodField()
    comment = serializers.CharField(max_length=500, default='')

    class Meta:
        model = api_models.File
        fields = '__all__'

    def get_upload_datetime(self, obj):
        datetime = obj.upload_datetime
        return datetime
    
    def get_size(self, obj):
        return obj.size

    def get_share_link(self, obj):
        return obj.share_link

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        by_user_id = representation['by_user']
        user = api_models.User.objects.filter(pk=by_user_id).values(
            'username').first() if by_user_id else None
        representation['by_user'] = user['username'] if user else None

        return representation
    

