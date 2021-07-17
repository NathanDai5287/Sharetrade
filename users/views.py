from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib import messages
from .forms import UserRegisterForm
from django.contrib.auth.decorators import login_required

@login_required
def home(request):
	if request.method == 'GET':
		return render(request, "users/home.html")
	else:
		portfolio = dict()
		for key, value in request.POST.items():
			if 'ticker' in key:
				ticker = value
			elif 'quantity' in key:
				portfolio[ticker] = int(value)
		return render(request, "users/analysis.html", {'portfolio': portfolio})

def register(request):
	if request.method == 'POST':
		form = UserRegisterForm(request.POST)
		if form.is_valid():
			form.save()
			username = form.cleaned_data.get('username')
			messages.success(request, 'Your account has been created! You are now able to log in.')
			return redirect('login')
	else:
		form = UserRegisterForm()
	return render(request, 'users/register.html', {'form': form})

@login_required
def profile(request):
	return render(request, 'users/profile.html')
