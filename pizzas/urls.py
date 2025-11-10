# pizzas/urls.py
from django.urls import path
from . import views

app_name = 'pizzas'
urlpatterns = [
    path('', views.pizza_list, name='pizza_list'),  # Lists all pizzas
    path('new/', views.new_pizza, name='new_pizza'),  # Add new pizza
    path('<int:pizza_id>/', views.pizza_detail, name='pizza_detail'),  # Pizza detail page
    path('new_topping/<int:pizza_id>/', views.new_topping, name='new_topping'),  # Add topping to pizza
]
