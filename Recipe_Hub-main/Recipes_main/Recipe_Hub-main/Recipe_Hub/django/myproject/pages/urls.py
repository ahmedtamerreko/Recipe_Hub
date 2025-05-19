from django.urls import path
from . import views
from .views import RecipeDetailView

urlpatterns = [
    path('', views.index, name='index'),
    path('user_signin/', views.user_signin, name='user_signin'),
    path('user_signup/', views.user_signup, name='user_signup'),
    path('user_dashboard/', views.user_dashboard, name='user_dashboard'),
    path('user_fav/', views.user_fav, name='user_fav'),
    path('adminSign_in/', views.adminSign_in, name='adminSign_in'),
    path('adminSignup/', views.adminSignup, name='adminSignup'),
    path('adminDashboard/', views.adminDashboard, name='adminDashboard'),
    path('api/recipes/', views.recipes_api, name='recipes_api'),
    path('add_favorite/<int:recipe_id>/', views.add_favorite, name='add_favorite'),
    path('user_signout/', views.user_signout, name='user_signout'),
    path('admin_signout/', views.admin_signout, name='admin_signout'),
    path('api/recipes/<int:id>/', RecipeDetailView.as_view(), name='recipe_detail'),
    path('api/favorites/', views.favorites_list),
    path('recipe_details/<int:recipe_id>/', views.recipe_details, name='recipe_details'),


]
