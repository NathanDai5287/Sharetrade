from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib import messages
from .forms import UserRegisterForm, UserUpdateForm, ProfileUpdateForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from .models import Stock

@login_required
def home(request):
	if request.method == 'GET':
		portfolio = Stock.objects.filter(user=request.user)
		return render(request, "users/edit.html", {'portfolio': portfolio})
	else:
		portfolio = dict()
		for key, value in request.POST.items():
			if 'ticker' in key:
				ticker = value
			elif 'quantity' in key:
				if ticker:
					portfolio[ticker] = int(value)
					stock = Stock.objects.filter(symbol=ticker, user=request.user).first()
					if stock:
						if stock.quantity != portfolio[ticker]:
							stock.quantity = portfolio[ticker]
							stock.save()
					else:
						stock = Stock(symbol=ticker, quantity=portfolio[ticker], user=request.user)
						stock.save()
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
	if request.method == 'POST':
		u_form = UserUpdateForm(request.POST, instance=request.user)
		p_form = ProfileUpdateForm(request.POST, request.FILES, instance=request.user.profile)
		if u_form.is_valid() and p_form.is_valid():
			u_form.save()
			p_form.save()
			messages.success(request, f'Your account, has been updatrd!')
			return redirect('profile')
	else:
		u_form = UserUpdateForm(instance=request.user)
		p_form = ProfileUpdateForm(instance=request.user.profile)

	context = {
		'u_form': u_form,
		'p_form': p_form
	}
	return render(request, 'users/profile.html', context)
