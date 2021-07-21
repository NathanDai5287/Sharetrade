async function draw(tickers, quantities) {
	var stocks = new Stocks('84W5MVCJ60YFQFI5');

	var ctx = document.getElementById('performance').getContext('2d');

	var data = {};

	for (let ticker of tickers) {
		let options = {
			symbol: ticker,
			interval: 'monthly',
			amount: 12,
		};

		var result;
		await stocks.timeSeries(options).then((temp) => {
			result = temp.map(function (data) {
				return {
					date: data.date,
					open: data.open,
				};
			});

			result.reverse()
		});

		stock = result;
		data[ticker] = stock;
	}

	var all = data;
	var portfolio = {};

	for (let i = 0; i < all[tickers[0]].length; i++) {
		date = data[tickers[0]][i]['date'];
		portfolio[date] = 0;

		for (let ticker of tickers) {
			try {
				portfolio[date] += data[ticker][i]['open'] * quantities[ticker];
			} catch (error) {
				console.log(error);
				console.log(ticker);
				console.log(data[ticker][i]);
			}
		}
	}

	var first = Object.keys(portfolio)[0];
	var price = portfolio[first];

	const scale = 100 / price;

	var dates = []; var prices = [];
	for (let [date, price] of Object.entries(portfolio)) {
		dateobject = new Date(date);
		dates.push(dateobject.getMonth() + '/' + dateobject.getDate() + '/' + dateobject.getFullYear());
		prices.push(Math.round(price * scale * 100) / 100);
		// prices.push(Math.round(price));
	}

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
