# backend/accounts/views.py

from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.utils import timezone
from geopy.distance import geodesic

# --- 1. ADD THESE TWO IMPORTS AT THE TOP ---
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

# Import Models used in this file
from .models import CustomUser, Employee, Store, Activity, EmployeeTask 

# Import Serializers used in this file
from .serializers import (
    RegisterSerializer,
    StoreSerializer,
    EmailTokenObtainPairSerializer,
    ActivitySerializer,
    EmployeeTaskSerializer
)

# -------------------------------
# User Registration (No changes)
# -------------------------------
class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

# -------------------------------
# User Login (No changes)
# -------------------------------
class EmailTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = EmailTokenObtainPairSerializer

# -------------------------------
# GET List of Stores for the Logged-in Employee (No changes to this one yet)
# -------------------------------
class EmployeeStoresView(generics.ListAPIView):
    serializer_class = StoreSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            return self.request.user.employee_profile.stores.all()
        except Employee.DoesNotExist:
            return Store.objects.none()

# -------------------------------
# POST a New Activity (No changes)
# -------------------------------
class CreateActivityView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        store_id = request.data.get('store')
        remarks = request.data.get('remarks')
        user_latitude = request.data.get('latitude')
        user_longitude = request.data.get('longitude')

        if not all([store_id, user_latitude, user_longitude]):
            return Response({"error": "Store ID and your current location (latitude, longitude) are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            store = Store.objects.get(pk=store_id)
            employee = request.user.employee_profile
        except (Store.DoesNotExist, Employee.DoesNotExist):
            return Response({"error": "Invalid Store or Employee profile."}, status=status.HTTP_404_NOT_FOUND)
        
        user_location = (user_latitude, user_longitude)
        store_location = (store.latitude, store.longitude)
        
        try:
            distance = geodesic(user_location, store_location).meters
        except (ValueError, TypeError):
             return Response({"error": "Invalid or missing location coordinates for the store or user."}, status=status.HTTP_400_BAD_REQUEST)
             
        if distance > 100:
            return Response({
                "error": f"You are approximately {int(distance)} meters away, and the maximum allowed distance is 100 meters."
            }, status=status.HTTP_403_FORBIDDEN)
            
        activity_data = {'employee': employee.pk, 'store': store.pk, 'remarks': remarks}
        serializer = ActivitySerializer(data=activity_data)

        if serializer.is_valid():
            serializer.save(employee=employee)
            try:
                today = timezone.now().date()
                task = EmployeeTask.objects.get(employee=employee, store=store, task_date=today, status='pending')
                task.status = 'completed'
                task.save()
            except EmployeeTask.DoesNotExist:
                pass 
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# -------------------------------
# GET List of Today's Activities for the Logged-in Employee
# -------------------------------
# --- 2. ADD THIS DECORATOR LINE ABOVE THE CLASS ---
@method_decorator(csrf_exempt, name='dispatch')
class TodaysActivitiesView(generics.ListAPIView):
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            employee = self.request.user.employee_profile
            today = timezone.now().date()
            return Activity.objects.filter(employee=employee, created_at__date=today).order_by('-created_at')
        except Employee.DoesNotExist:
            return Activity.objects.none()

# -------------------------------
# GET List of Today's Tasks for the Logged-in Employee
# -------------------------------
# --- 3. ADD THIS DECORATOR LINE ABOVE THE CLASS ---
@method_decorator(csrf_exempt, name='dispatch')
class TodaysTasksView(generics.ListAPIView):
    serializer_class = EmployeeTaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            employee = self.request.user.employee_profile
            today = timezone.now().date()
            return EmployeeTask.objects.filter(employee=employee, task_date=today)
        except Employee.DoesNotExist:
            return EmployeeTask.objects.none()