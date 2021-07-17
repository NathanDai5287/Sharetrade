from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

class Schedule(models.Model):
	start_time = models.DateTimeField()
	end_time = models.DateTimeField()
	user = models.ForeignKey(User, on_delete=models.CASCADE)

class Profile(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE)
	image = models.ImageField(default='default.jpg', upload_to='profile_pics')

	def __str__(self):
		return f'{self.user.username} Profile'

class Stock(models.Model):
	symbol = models.CharField(max_length=4)
	quantity = models.IntegerField()
	user = models.ForeignKey(User, on_delete=models.CASCADE)

	def __str__(self):
		return f'{self.user.username}, {self.symbol}, {self.quantity}'