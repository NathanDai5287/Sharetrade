apikeys = [
	'84W5MVCJ60YFQFI5',
	'77R1IJ6QVWT53UMJ',
	'RR8JGJ1SMXNKJKK5',
	'9P9IEIGNGDIDMPAF',
	'BALZ7BMX4ODUWEV4',
	'M8YMBC9P4HX8ZAIU',
	'OD0AUY7SYVOUX97I',
	'YMWSGWB5IR803PJE',
	'RGYZNMGNB1K370KS',
	'KRB5IMWOV9CZUPQX',
	'6FGVLK43191K9IPZ',
]

function save(ticker, data) {
	localStorage.setItem(ticker, data);
}

function load_day(ticker, date) {
	return localStorage[ticker][date]
}

async function get_data(ticker) {
	if (!(ticker in localStorage)) {

		var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=' + ticker + '&apikey=84W5MVCJ60YFQFI5';

		var response = await fetch(url);
		var data = await response.json();

		let i = 1;
		let apikey;
		while (data['Monthly Adjusted Time Series'] == undefined) {
			apikey = apikeys[i++];
			var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=' + ticker + '&apikey=' + apikey;

			response = await fetch(url);
			data = await response.json();
		}

		data = data['Monthly Adjusted Time Series'];
	} else {}

	var trimmed = {};
	i = 0;

	try {
		for (let [date, value] of Object.entries(data)) {
			if (i++ == 12) {
				break;
			}

			trimmed[date] = Number(value['5. adjusted close']);
		}
	} catch (e) {
		console.log(e);
		console.log(data);
	}

	return trimmed;
}

async function all_data(tickers) {
	var stock;
	var data = {};

	for (let ticker of tickers) {
		stock = await get_data(ticker);

		data[ticker] = stock;
	}

	return data;
}

async function average(tickers, quantities) {
	var data = await all_data(tickers);

	var portfolio = {};

	var dates = Object.keys(data[tickers[0]]);
	var date;
	for (let i = 0; i < dates.length; i++) {
		date = dates[i];
		portfolio[date] = 0;

		for (let ticker of tickers) {
			if (data[ticker][date] == undefined) {
				data[ticker][date] = data[ticker][dates[i - 1]];
			}
			portfolio[date] += data[ticker][date] * quantities[ticker];
		}
	}

	console.log(portfolio);

	return portfolio;
}

async function draw(tickers, quantities) {
	var ctx = document.getElementById('performance').getContext('2d');

	var portfolio = await average(tickers, quantities);

	var last = Object.keys(portfolio)[Object.keys(portfolio).length - 1];
	var price = portfolio[last];

	const scale = 100 / price;

	var dates = []; var prices = [];
	for (let [date, price] of Object.entries(portfolio)) {
		var dateobject = new Date(date);
		dates.push(dateobject.getMonth() + '/' + dateobject.getDate() + '/' + dateobject.getFullYear());

		prices.push(Math.round(price * scale * 100) / 100);
	}

	prices.reverse();
	dates.reverse();

	console.log(prices);

	var chart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: dates,
			datasets: [{
				label: 'Portfolio Performance',
				data: prices,
				backgroundColor: [
					'rgba(255, 99, 132, 0.2)',
					'rgba(54, 162, 235, 0.2)',
					'rgba(255, 206, 86, 0.2)',
					'rgba(75, 192, 192, 0.2)',
					'rgba(153, 102, 255, 0.2)',
					'rgba(255, 159, 64, 0.2)'
				],
				borderColor: [
					'rgba(255, 99, 132, 1)',
					'rgba(54, 162, 235, 1)',
					'rgba(255, 206, 86, 1)',
					'rgba(75, 192, 192, 1)',
					'rgba(153, 102, 255, 1)',
					'rgba(255, 159, 64, 1)'
				],
				borderWidth: 1
			}]
		},
		options: {
			scales: {
				y: {
					beginAtZero: true
				}
			}
		}

	});
}

function get_portfolio() {
	portfolio = {}

	var stocks = document.getElementsByClassName('stock');

	var ticker, quantity;
	for (let stock of stocks) {
		ticker = stock.children[0];
		quantity = stock.children[1];

		portfolio[ticker.innerText] = quantity.innerText;
	}

	return portfolio
}

window.onload = function () { // TODO: cache data in client browser
	var portfolio = get_portfolio();
	var tickers = Object.keys(portfolio);

	draw(tickers, portfolio);
};
