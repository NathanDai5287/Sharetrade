async function get_data(ticker, interval='monthly', amount=12) {
	var stocks = new Stocks('84W5MVCJ60YFQFI5');

	var options = {
		symbol: ticker,
		interval: interval,
		amount: amount
	};

	var result;
	// await stocks.timeSeries(options).then((temp) => {
	stocks.timeSeries(options).then((temp) => {

		result = temp.map(function (data) {
			return {
				// date: data.date.getMonth() + "/" + (data.date.getYear() - 100),
				date: data.date,
				open: data.open,
			};
		});

		result.reverse();
	});

	console.log(result);
	return result;
}

async function all_data(tickers) {
	var stock;
	var data = {};
	for (let ticker of tickers) {
		// await get_data(ticker).then((temp) => {
		await get_data(ticker).then((temp) => {
			stock = temp;
			data[ticker] = stock;
		});
	}

	console.log(data);
	return data;
}

async function average(tickers, quantities) {
	var data;
	// await all_data(tickers).then((temp) => {
	all_data(tickers).then((temp) => {
		data = temp;

		var portfolio = {};
		for (let i = 0; i < data[tickers[0]].length; i++) {
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
		console.log(portfolio);
		return portfolio;
	});
}

async function draw(tickers, quantities) {
	var ctx = document.getElementById('performance').getContext('2d');

	// var portfolio = await average(tickers, quantities);
	var portfolio;
	average(tickers, quantities).then((data) => {
		portfolio = data;

		var first = Object.keys(portfolio)[0];
		var price = portfolio[first];

		const scale = 100 / price;

		var dates = []; var prices = [];
		for (let [date, price] of Object.entries(portfolio)) {
			// console.log(date.getMonth());
			// dates.push(date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear());
			dateobject = new Date(date);
			dates.push(dateobject.getMonth() + '/' + dateobject.getDate() + '/' + dateobject.getFullYear());
			prices.push(Math.round(price * scale * 100) / 100);
		}

		// console.log(dates);
		// console.log(prices);

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
