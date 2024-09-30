from rest_framework import serializers
from django.contrib.auth.models import User
from .models import TaskManager
from django.contrib.auth import authenticate


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'email']
        extra_kwargs = {'password':{'write_only': True}}
        
    def create(self, validated_data):
        user = User.objects.create_user(
            username = validated_data['username'],
            password = validated_data['password'],
            email    = validated_data.get('email','')
        )
        
        return user
    
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        user = authenticate(**data)
        if user is None or not user.is_active:
            raise serializers.ValidationError("Invalid credentials")
        return user

class TaskmanagerSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskManager
        fields = '__all__'
        