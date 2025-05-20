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
    #ingredients = models.TextField()
    description = models.TextField()
    image = models.ImageField(upload_to='recipes/', blank=True, null=True)
    # def delete(self, *args, **kwargs):
    # if self.image:
    #     if os.path.isfile(self.image.path):
    #         os.remove(self.image.path)
    # super().delete(*args, **kwargs)


    # class Recipe(models.Model):
    # title = models.CharField(max_length=100)
    # description = models.TextField()
    
    # image = models.ImageField(upload_to='recipes/', blank=True, null=True)

    # def __str__(self):
    #     return self.title

    
            
class Favorite(models.Model):
    user = models.ForeignKey(UserData, on_delete=models.CASCADE)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.name} - {self.recipe.name}"

