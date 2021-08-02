from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from PIL  import Image

# class Schedule(models.Model):
# 	start_time = models.DateTimeField()
# 	end_time = models.DateTimeField()
# 	user = models.ForeignKey(User, on_delete=models.CASCADE)

class Profile(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE)
	image = models.ImageField(default='default.jpg', upload_to='profile_pics')

	def __str__(self):
		return f'{self.user.username} Profile'

	def save(self):
		super().save()
		img = Image.open(self.image.path)
		if img.height > img.width:
			img = img.crop((0, (img.height-img.width)/2, img.width, (img.height+img.width)/2))
		if img.height < img.width:
			img = img.crop(((img.width-img.height)/2, 0, (img.width+img.height)/2, img.height))
		if img.height > 300:
			output_size = (300, 300)
			img.thumbnail(output_size)
			img.save(self.image.path)

class Stock(models.Model):
	symbol = models.CharField(max_length=4)
	quantity = models.IntegerField()
	user = models.ForeignKey(User, on_delete=models.CASCADE)

	def __str__(self):
		return f'{self.user.username}, {self.symbol}, {self.quantity}'