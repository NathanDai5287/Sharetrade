function format_date(date) {

}

async function get_data(ticker) {
	var stocks = new Stocks('84W5MVCJ60YFQFI5');

	var options = {
		symbol: ticker,
		interval: 'monthly',
		amount: 12,
	};

	var result = await stocks.timeSeries(options);

	result = result.map(function (data) {
		return {
			date: data.date.getMonth() + "/" + (data.date.getYear() - 100),
			open: data.open,
		};
	});

	result.reverse();

	console.log(toString(result[0]['date']));

	return result;
}

async function draw(ticker) {
	var ctx = document.getElementById('performance').getContext('2d');

	await get_data(ticker).then((result) => {
		data = result;
	});
	console.log(data);

	var dates = data.map(function (datapoint) {
		return datapoint.date;
	});

	var prices = data.map(function (datapoint) {
		return datapoint.open;
	});

	var myChart = new Chart(ctx, {
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

window.onload = function() {
	draw('tsla');
};
