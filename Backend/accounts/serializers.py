from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model

# Import models directly. It's safe here because they don't depend on serializers.
from .models import Store, Employee, Activity, Company

# Get the CustomUser model once. This is the recommended way.
User = get_user_model()


# --- User & Authentication Serializers ---


# A simple serializer to display user data without the password.
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'role')

# This is the new, corrected RegisterSerializer.
# It is NOT a ModelSerializer, which breaks the circular dependency.
class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100, required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(min_length=6, write_only=True, required=True)
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, default='employee')

    def create(self, validated_data):
        """
        Create and return a new user.
        """
        user = User.objects.create_user(
            email=validated_data['email'],
            name=validated_data['name'],
            password=validated_data['password'],
            role=validated_data['role']
        )
        return user


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # The default validation is sufficient if the USERNAME_FIELD is 'email'.
        # We add custom data to the response.
        data = super().validate(attrs)
        
        # Add custom claims
        data.update({
            "user_id": self.user.id,
            "name": self.user.name,
            "role": self.user.role,
            "email": self.user.email,
        })
        return data


# --- Application Data Serializers ---

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'


class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = ["store_id", "store_information", "location", "latitude", "longitude", "company"]


class ActivitySerializer(serializers.ModelSerializer):
    # Make the response more user-friendly by including the store name
    store_name = serializers.CharField(source='store.store_information', read_only=True)
    
    class Meta:
        model = Activity
        fields = ['id', 'employee', 'store', 'store_name', 'remarks', 'created_at']
        read_only_fields = ['employee'] # Employee is set from the request user

class EmployeeTaskSerializer(serializers.ModelSerializer):
    store = StoreSerializer(read_only=True) # Nest the store detailsfrom rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model

# Import models directly.
from .models import Store, Employee, Activity, Company, EmployeeTask # <--- Make sure EmployeeTask is imported

# Get the CustomUser model once.
User = get_user_model()


# --- User & Authentication Serializers ---

# A simple serializer to display user data without the password.
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'role')

# This is the new, corrected RegisterSerializer.
class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100, required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(min_length=6, write_only=True, required=True)
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, default='employee')

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            name=validated_data['name'],
            password=validated_data['password'],
            role=validated_data['role']
        )
        return user


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        
        data.update({
            "user_id": self.user.id,
            "name": self.user.name,
            "role": self.user.role,
            "email": self.user.email,
        })
        return data


# --- Application Data Serializers ---

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'


class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = ["store_id", "store_information", "location", "latitude", "longitude", "company"]


class ActivitySerializer(serializers.ModelSerializer):
    store_name = serializers.CharField(source='store.store_information', read_only=True)
    
    class Meta:
        model = Activity
        fields = ['id', 'employee', 'store', 'store_name', 'remarks', 'created_at']
        read_only_fields = ['employee']


# --- ADD THIS NEW SERIALIZER AT THE END ---
class EmployeeTaskSerializer(serializers.ModelSerializer):
    store = StoreSerializer(read_only=False)
    
    class Meta:
        model = EmployeeTask
        fields = ['id', 'store', 'sequence_order', 'status', 'task_date']

    class Meta:
        model = EmployeeTask
        fields = ['id', 'store', 'sequence_order', 'status', 'task_date']        
        