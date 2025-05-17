from django.shortcuts import render
from .models import UserData
from django.shortcuts import redirect
from django.contrib import messages
from .models import AdminData

def index(request ):
    return render(request,'index.html')

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
        return redirect('login')  
    return render(request, 'user/UserSign-Up.html')

            

def user_dashboard(request):

    return render(request, 'user/UserDashboard.html')

def recipeDetails(request):
    return render(request, 'user/recipeDetails.html')

def favorite(request):
    return render(request, 'user/Favorite.html')

def adminDashboard(request):
    return render(request, 'admin/adminDashboard.html')

def adminSign_in(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        try:
            admin = AdminData.objects.get(email=email, password=password)
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

