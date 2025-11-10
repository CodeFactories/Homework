# views.py
from django.shortcuts import render, redirect
from .models import Pizza, Topping
from .forms import PizzaForm, ToppingForm

def index(request):
    """Home page for the pizzas app."""
    return render(request, 'pizzas/index.html')

def pizza_list(request):
    """Show all pizzas."""
    pizzas = Pizza.objects.order_by('date_added')
    context = {'pizzas': pizzas}
    return render(request, 'pizzas/pizza_list.html', context)

def pizza_detail(request, pizza_id):
    """Show a single pizza and all its toppings."""
    pizza = Pizza.objects.get(id=pizza_id)
    toppings = pizza.topping_set.order_by('date_added')
    context = {'pizza': pizza, 'toppings': toppings}
    return render(request, 'pizzas/pizza_detail.html', context)

def new_pizza(request):
    """Add a new pizza."""
    if request.method != 'POST':
        form = PizzaForm()
    else:
        form = PizzaForm(data=request.POST)
        if form.is_valid():
            form.save()
            return redirect('pizzas:pizza_list')

    context = {'form': form}
    return render(request, 'pizzas/new_pizza.html', context)

def new_topping(request, pizza_id):
    """Add a new topping to a pizza."""
    pizza = Pizza.objects.get(id=pizza_id)
    
    if request.method != 'POST':
        form = ToppingForm()
    else:
        form = ToppingForm(data=request.POST)
        if form.is_valid():
            new_topping = form.save(commit=False)
            new_topping.pizza = pizza  # Associate the topping with the pizza
            new_topping.save()
            return redirect('pizzas:pizza_detail', pizza_id=pizza.id)

    context = {'pizza': pizza, 'form': form}
    return render(request, 'pizzas/new_topping.html', context)
