from django.shortcuts import render
from .models import UserData
from django.shortcuts import redirect
from django.contrib import messages
from .models import AdminData
from .models import Recipe
from django.http import JsonResponse

def index(request ):
    return render(request,'index.html')

def user_fav(request):
    return render(request, 'user/Favorite.html')
def user_signin(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        try:
            user = UserData.objects.get(email=email, password=password)
            messages.success(request, "Login successful.")
            return redirect('user_dashboard')  
        except UserData.DoesNotExist:
            messages.error(request, "Invalid username or password.")
            return render(request, 'user/UserSign-in.html')
    return render(request, 'user/UserSign-in.html')



def user_signup(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirmed_pass')  # الاسم الصحيح من الـ HTML
        email = request.POST.get('email')

        if password != confirm_password:
            messages.error(request, "Passwords do not match.")
            return render(request, 'user/UserSign-Up.html')

        data = UserData(
            name=username,
            email=email,
            password=password  
        )
        data.save()
        messages.success(request, "Account created successfully.")
        return redirect('user_signin')  
    return render(request, 'user/UserSign-Up.html')

            

def get_recipes_api(request):
    recipes = Recipe.objects.all()
    data = []
    for recipe in recipes:
        data.append({
            'id': recipe.id,
            'name': recipe.name,
            'category': recipe.category,
            'description': recipe.description,
            'image': recipe.image.url if recipe.image else '',
        })
    return JsonResponse(data, safe=False)

def user_dashboard(request):
    if request.method == 'POST':
        name = request.POST.get('recipe-name')
        category = request.POST.get('recipe-category')  # تغيير الاسم من CATEGORY_CHOICES إلى category
        description = request.POST.get('recipe-description')
        image = request.FILES.get('recipe-image')
        Recipe.objects.create(
            name=name,
            category=category,  # استخدم الحقل الصحيح
            description=description,
            image=image
        )
        return redirect('user_dashboard')
    recipes = Recipe.objects.all()

    return render(request, 'user/UserDashboard.html', {'recipes': recipes})

def recipeDetails(request):
    return render(request, 'user/recipeDetails.html')

def favorite(request):
    return render(request, 'user/Favorite.html')

def adminDashboard(request):
    if request.method == 'POST':
        name = request.POST.get('recipe-name')
        category = request.POST.get('recipe-category')  # تغيير الاسم من CATEGORY_CHOICES إلى category
        description = request.POST.get('recipe-description')
        image = request.FILES.get('recipe-image')

        Recipe.objects.create(
            name=name,
            category=category,  # استخدم الحقل الصحيح
            description=description,
            image=image
        )
        return redirect('adminDashboard')

    recipes = Recipe.objects.all()
    context = {
        'recipes': recipes
    }
    return render(request, 'admin/adminDashboard.html', context)


def adminSign_in(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        password = request.POST.get('password')
        try:
            admin = AdminData.objects.get(name=name, password=password)
            messages.success(request, "Login successful.")
            return redirect('adminDashboard')  
        except AdminData.DoesNotExist:
            messages.error(request, "Invalid username or password.")
            return render(request, 'admin/adminSign_in.html')
    return render(request, 'admin/adminSign_in.html')

def adminSignup(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')  # الاسم الصحيح من الـ HTML
        email = request.POST.get('email')

        if password != confirm_password:
            messages.error(request, "Passwords do not match.")
            return render(request, 'admin/adminSign_up.html')

        data = AdminData(
            name=username,
            email=email,
            password=password  
        )
        data.save()
        messages.success(request, "Account created successfully.")
        return redirect('adminSign_in')
    return render(request, 'admin/adminSign_up.html')


def recipe_details(request, recipe_id):
    recipe = get_object_or_404(Recipe, id=recipe_id)
    return render(request, 'user/recipeDetails.html', {'recipe': recipe})