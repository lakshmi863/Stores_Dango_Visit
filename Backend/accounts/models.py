# C:\Users\Lenovo\Desktop\React and Django\Backend\accounts\models.py

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

# -------------------
# Company Model
# -------------------
class Company(models.Model):
    name = models.CharField(max_length=150)
    address = models.TextField(blank=True)
    def __str__(self): return self.name
    class Meta: verbose_name_plural = "Companies"

# -------------------
# Custom User Manager & Model
# -------------------
class CustomUserManager(BaseUserManager):
    def create_user(self, email, name, password=None, role="employee", **extra_fields):
        if not email:
            raise ValueError("The Email field is required")
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None, **extra_fields):
        extra_fields.setdefault("role", "admin")
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, name, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [("admin", "Admin"), ("employee", "Employee")]
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="employee")
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    objects = CustomUserManager()
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]
    def __str__(self): return f"{self.name} ({self.role})"

# -------------------
# Store Model
# -------------------
class Store(models.Model):
    store_id = models.AutoField(primary_key=True)
    store_information = models.CharField(max_length=255)
    location = models.CharField(max_length=100, default="Hyderabad")
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="stores", null=True, blank=True)
    def __str__(self): return f"Store {self.store_id} - {self.store_information}"

# -------------------
# Employee Model
# -------------------
class Employee(models.Model):
    emp_id = models.AutoField(primary_key=True)
    emp_name = models.CharField(max_length=100)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="employee_profile", null=True, blank=True)
    stores = models.ManyToManyField(Store, related_name="employees", blank=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="employees", null=True, blank=True)
    def __str__(self): return f"{self.emp_name} (ID: {self.emp_id})"

# -------------------
# Activity Model
# -------------------
class Activity(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="activities")
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name="activities")
    remarks = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self): return f"Activity by {self.employee.emp_name} at {self.store.store_information} on {self.created_at.strftime('%Y-%m-%d')}"

# -------------------
# Signals
# -------------------
@receiver(post_save, sender=CustomUser)
def create_employee_profile(sender, instance, created, **kwargs):
    if created and instance.role == "employee":
        Employee.objects.create(user=instance, emp_name=instance.name)
# -------------------
# Employee Task Model
# -------------------        
class EmployeeTask(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("completed", "Completed"),
    ]

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='tasks')
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='tasks')
    sequence_order = models.PositiveIntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    # This is the field the error was about
    task_date = models.DateField(auto_now_add=True)

    class Meta:
        ordering = ['sequence_order']
        unique_together = ('employee', 'store', 'task_date')

    def __str__(self):
        return f"Task for {self.employee.emp_name} at {self.store.store_information} on {self.task_date}"      