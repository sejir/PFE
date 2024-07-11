from authentication.models import User, Profile
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.db import transaction, IntegrityError

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['full_name', 'bio', 'image', 'verified','role']

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # These are claims, you can add custom claims
        token['full_name'] = user.profile.full_name
        token['username'] = user.username
        token['email'] = user.email
        token['bio'] = user.profile.bio
        token['image'] = str(user.profile.image.url if user.profile.image else '')
        token['verified'] = user.profile.verified
        token['role'] = user.role

        return token

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, write_only=True)

    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'password2', 'role')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    def create(self, validated_data):
       rolee = validated_data.pop('role')
       user = User.objects.create_user(
                username=validated_data['username'],
                email=validated_data['email'],
                password=validated_data['password'],
                role=rolee          
                    )
   
       return user
    
class ProfileUpdateSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='profile.full_name', required=False)
    bio = serializers.CharField(source='profile.bio', required=False)
    image = serializers.ImageField(source='profile.image', required=False)
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, required=False)
    password = serializers.CharField(write_only=True, required=False)
    password2 = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'full_name', 'bio', 'image', 'role']

    def validate(self, attrs):
        if 'password' in attrs and attrs['password'] != attrs.get('password2'):
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        password = validated_data.pop('password', None)
        password2 = validated_data.pop('password2', None)

        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        
        if password and password == password2:
            instance.set_password(password)
        
        instance.save()

        profile = instance.profile
        profile.full_name = profile_data.get('full_name', profile.full_name)
        profile.bio = profile_data.get('bio', profile.bio)
        if 'image' in profile_data:
            profile.image = profile_data['image']
        profile.save()

        return instance
    