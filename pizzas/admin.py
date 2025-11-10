from django.contrib import admin
from .models import Pizza, Topping

# Register your models here.
# pizzas/admin.py
admin.site.register(Pizza)
admin.site.register(Topping)
