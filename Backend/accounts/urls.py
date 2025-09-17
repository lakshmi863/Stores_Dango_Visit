# THIS LINE IS CRUCIAL
from django.urls import path

from .views import (
    RegisterView,
    EmailTokenObtainPairView,
    EmployeeStoresView,
    CreateActivityView,
    TodaysActivitiesView,
    TodaysTasksView
)

urlpatterns = [
    # --- Authentication ---
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", EmailTokenObtainPairView.as_view(), name="login"),

    # --- Employee Data Endpoints ---
    path("employee/stores/", EmployeeStoresView.as_view(), name="employee-stores"),
    
    # --- Activity Endpoints ---
    path("activities/today/", TodaysActivitiesView.as_view(), name="todays-activities"),
    path("activities/create/", CreateActivityView.as_view(), name="create-activity"),
    path("tasks/today/", TodaysTasksView.as_view(), name="todays-tasks"),
]