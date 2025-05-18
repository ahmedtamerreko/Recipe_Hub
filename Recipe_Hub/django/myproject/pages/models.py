from django.db import models

# Create your models here.
class UserData(models.Model):
    name = models.CharField(max_length=50)
    email = models.EmailField()
    password = models.CharField(max_length=50)
    confirm_password = models.CharField(max_length=50)

class AdminData(models.Model):
    name = models.CharField(max_length=50)
    email = models.EmailField()
    password = models.CharField(max_length=50)
    confirm_password = models.CharField(max_length=50)


class Recipe(models.Model):
    CATEGORY_CHOICES = [
        ('Main Course', 'Main Course'),
        ('Appetizers', 'Appetizers'),
        ('Desserts', 'Desserts'),
    ]

    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='Main Course')  # الحقل المفقود
    description = models.TextField()
    image = models.ImageField(upload_to='recipes/', blank=True, null=True)

    