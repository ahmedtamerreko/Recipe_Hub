from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.http import JsonResponse, HttpResponseNotFound
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.views import View
from .models import Recipe, UserData, AdminData, Favorite
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.db.models import Q

def index(request):
    return render(request, 'index.html')

@method_decorator(csrf_exempt, name='dispatch')
class RecipeDetailView(View):
    def get(self, request, id):
        try:
            recipe = Recipe.objects.get(pk=id)
            data = {
                'id': recipe.id,
                'name': recipe.name,
                'category': recipe.category,
                'description': recipe.description,
                'image': recipe.image.url if recipe.image else ''
            }
            return JsonResponse(data)
        except Recipe.DoesNotExist:
            return HttpResponseNotFound('Recipe not found')

    def delete(self, request, id):
        try:
            recipe = Recipe.objects.get(pk=id)
            recipe.delete()
            return JsonResponse({'message': 'Deleted'})
        except Recipe.DoesNotExist:
            return HttpResponseNotFound('Recipe not found')

    def put(self, request, id):
        try:
            recipe = Recipe.objects.get(pk=id)
        except Recipe.DoesNotExist:
            return HttpResponseNotFound('Recipe not found')

        if request.content_type.startswith('multipart/form-data'):
            data = request.POST
        else:
            from django.http import QueryDict
            data = QueryDict(request.body)

        recipe.name = data.get("name", recipe.name)
        recipe.category = data.get("category", recipe.category)
        recipe.description = data.get("description", recipe.description)

        if 'image' in request.FILES:
            recipe.image = request.FILES['image']

        recipe.save()
        return JsonResponse({'message': 'Recipe updated'})

def user_signin(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        try:
            user = UserData.objects.get(email=email, password=password)
            request.session['user_id'] = user.id
            messages.success(request, "Login successful.")
            return redirect('user_dashboard')
        except UserData.DoesNotExist:
            messages.error(request, "Invalid username or password.")
    return render(request, 'user/UserSign-in.html')

def user_signup(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirmed_pass')
        email = request.POST.get('email')
        if password != confirm_password:
            messages.error(request, "Passwords do not match.")
            return render(request, 'user/UserSign-Up.html')
        UserData.objects.create(name=username, email=email, password=password, confirm_password=confirm_password)
        messages.success(request, "Account created successfully.")
        return redirect('user_signin')
    return render(request, 'user/UserSign-Up.html')

def user_signout(request):
    logout(request)
    return redirect('index')

def user_dashboard(request):
    if request.method == 'POST':
        name = request.POST.get('recipe-name')
        category = request.POST.get('recipe-category')
        description = request.POST.get('recipe-description')
        image = request.FILES.get('recipe-image')
        Recipe.objects.create(name=name, category=category, description=description, image=image)
        return redirect('user_dashboard')
    recipes = Recipe.objects.all()
    return render(request, 'user/UserDashboard.html', {'recipes': recipes})

@csrf_exempt
def recipes_api(request):
    if request.method == "GET":
        query = Q()

        filter_text = request.GET.get('search', '')
        if filter_text:
            query &= Q(name__icontains=filter_text) | Q(description__icontains=filter_text)

        category_filter = request.GET.get('category', 'All')
        if category_filter != 'All':
            query &= Q(category=category_filter)

        recipes = Recipe.objects.filter(query)
        data = [{
            'id': r.id,
            'name': r.name,
            'category': r.category,
            'description': r.description,
            'image': r.image.url if r.image else ''
        } for r in recipes]
        return JsonResponse(data, safe=False)

    elif request.method == "POST":
        name = request.POST.get("name")
        category = request.POST.get("category")
        description = request.POST.get("description")
        image = request.FILES.get("image")

        if not name or not category or not description:
            return JsonResponse({"error": "Missing fields"}, status=400)

        recipe = Recipe.objects.create(
            name=name,
            category=category,
            description=description,
            image=image
        )
        return JsonResponse({
            "message": "Recipe created",
            "id": recipe.id
        }, status=201)

    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)

def user_fav(request):
    return render(request, 'user/Favorite.html')

@login_required
def add_favorite(request, recipe_id):
    recipe = get_object_or_404(Recipe, id=recipe_id)
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        if not request.user.is_authenticated:
            return JsonResponse({'status': 'login_required'}, status=401)
        favorite, created = Favorite.objects.get_or_create(user=request.user, recipe=recipe)
        if created:
            return JsonResponse({'status': 'added'})
        else:
            favorite.delete()
            return JsonResponse({'status': 'removed'})
    else:
        Favorite.objects.get_or_create(user=request.user, recipe=recipe)
        return redirect('user_dashboard')

def favorite(request):
    return render(request, 'user/Favorite.html')

def adminSign_in(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        password = request.POST.get('password')
        try:
            AdminData.objects.get(name=name, password=password)
            messages.success(request, "Login successful.")
            return redirect('adminDashboard')
        except AdminData.DoesNotExist:
            messages.error(request, "Invalid username or password.")
    return render(request, 'admin/adminSign_in.html')

def adminSignup(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')
        email = request.POST.get('email')
        if password != confirm_password:
            messages.error(request, "Passwords do not match.")
            return render(request, 'admin/adminSign_up.html')
        AdminData.objects.create(name=username, email=email, password=password, confirm_password=confirm_password)
        messages.success(request, "Account created successfully.")
        return redirect('adminSign_in')
    return render(request, 'admin/adminSign_up.html')

def adminDashboard(request):
    if request.method == 'POST':
        name = request.POST.get('recipe-name')
        category = request.POST.get('recipe-category')
        description = request.POST.get('recipe-description')
        image = request.FILES.get('recipe-image')
        Recipe.objects.create(name=name, category=category, description=description, image=image)
        return redirect('adminDashboard')
    recipes = Recipe.objects.all()
    return render(request, 'admin/adminDashboard.html', {'recipes': recipes})

def admin_signout(request):
    logout(request)
    return redirect('index')

from django.http import JsonResponse

def favorites_list(request):
    data = {
        "favorites": [
            {"id": 1, "title": "Pizza"},
            {"id": 2, "title": "Pasta"}
        ]
    }
    return JsonResponse(data)
def recipe_details(request, recipe_id):
    recipe = get_object_or_404(Recipe, id=recipe_id)
    return render(request, 'user/recipeDetails.html', {'recipe': recipe})