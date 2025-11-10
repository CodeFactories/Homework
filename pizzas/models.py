from django.db import models

# Create your models here.
class Pizza(models.Model):
    """A Pizza holds the name values, such as Hawaiian and Meat Lovers."""
    name = models.CharField(max_length=200)
    date_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        """Return a string representation of the model."""
        return self.name

class Topping(models.Model):
    """A Topping is related to a Pizza, holding a topping name like pineapple, sausage."""
    pizza = models.ForeignKey(Pizza, on_delete=models.CASCADE, related_name='toppings')
    name = models.TextField()
    date_added = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'toppings'

    def __str__(self):
        """Return a simple string representing the entry."""
        return f"{self.name[:50]}..."

