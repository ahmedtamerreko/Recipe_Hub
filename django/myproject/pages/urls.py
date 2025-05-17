from django.urls import path
from . import views
from django.contrib import admin

urlpatterns =[
    path('admin/', admin.site.urls),
    path('',views.index,name='index'),
    path('user_signin/', views.user_signin, name='user_signin'),
    path('user_signup/', views.user_signup, name='user_signup'),
    path('user_dashboard/', views.user_dashboard, name='user_dashboard'),
    path('user_recipeDetails/', views.recipeDetails, name='user_recipeDetails'),
    path('user_fav/', views.favorite, name='user_fav'),
    path('adminSign_in/', views.adminSign_in, name='adminSign_in'),
    path('adminSignup/', views.adminSignup, name='adminSignup'),
    path('adminDashboard/', views.adminDashboard, name='adminDashboard'),
]
