from django.contrib import admin
from .models import UserData
from .models import AdminData
from .models import Recipe
# Register your models here.
admin.site.register(UserData)
admin.site.register(AdminData)
admin.site.register(Recipe)

