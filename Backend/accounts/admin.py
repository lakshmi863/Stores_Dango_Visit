from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin

# Import all of your models so we can register them
from .models import Store, Employee, Company, Activity,EmployeeTask 

# Get the custom user model lazily
User = get_user_model()

# This is our custom admin configuration for our custom user.
# It inherits from the standard UserAdmin but overrides the problematic fields.
class CustomUserAdmin(UserAdmin):
    # What fields to display in the main user list page
    list_display = ('email', 'name', 'role', 'is_staff', 'is_active')
    
    # What fields to use when searching for a user
    search_fields = ('email', 'name')
    
    # How to order the list of users
    ordering = ('email',)

    # --- Crucial fields to override ---
    # Since we don't use a 'username' field, these must be explicitly set.
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('name', 'role')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'role', 'password'),
        }),
    )
    
    # These must be empty for custom user models
    filter_horizontal = ()
    list_filter = ()


# Now we register ALL our models with the admin site.
admin.site.register(User, CustomUserAdmin)
admin.site.register(Store)
admin.site.register(Employee)
admin.site.register(Company)
admin.site.register(Activity)
admin.site.register(EmployeeTask)