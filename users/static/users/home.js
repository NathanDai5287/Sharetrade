class Portfolio {
	constructor(stocks, quantities) {
		if (stocks.length !== quantities.length) {
			throw new Error('The length of stocks and quantities must be equal');
		}

		this.stocks = []
		for (let i = 0; i < stocks.length; i++) {
			this.stocks.push({
				symbol: stocks[i].value,
				quantity: quantities[i].value
			});
		}
	}
}

function caps(ticker) {
	var start = ticker.selectionStart;
	var end = ticker.selectionEnd;

	ticker.value = ticker.value.toUpperCase();
	ticker.setSelectionRange(start, end);
}

function check(quantity) {
	let n = parseInt(quantity.value);

	if (n < 1) {
		quantity.value = 1;
	}
}

function last(event) {
	if (event.keyCode !=  9) {
		return;
	}

	var form = document.getElementById('portfolio');
	var active = document.activeElement;

	var rows = form.children;
	var last = rows[rows.length - 1].children[1].children[0];

	if (active == last) {
		row();
	}
}

function row() {
	var form = document.getElementsByClassName('portfolio')[0];

	var row, td, trash, input;

	var stock = document.getElementsByClassName('stock');
	var next_index = stock.length;

	row = document.createElement('tr');
	row.setAttribute('class', 'stock');
		td = document.createElement('td');
			input = document.createElement('input');
				input.setAttribute('name', 'ticker_' + next_index);
				input.setAttribute('class', 'ticker');
				input.setAttribute('type', 'text');
				input.setAttribute('onkeyup', 'caps(this)');
				input.setAttribute('maxlength', 5);
		td.appendChild(input);
	row.appendChild(td);
		td = document.createElement('td');
			input = document.createElement('input');
				input.setAttribute('name', 'quantity_' + next_index);
				input.setAttribute('class', 'quantity');
				input.setAttribute('type', 'number');
				input.setAttribute('onkeyup', 'check(this)');
				input.setAttribute('onClick', 'check(this)');
		td.appendChild(input);
	row.appendChild(td);
		td = document.createElement('td');
			trash = document.createElement('button');
				trash.setAttribute('class', 'trash');
				trash.setAttribute('onClick', 'trash(this.parentNode)');
				trash.setAttribute('tabindex', -1);
				trash.innerText = 'X';
		td.appendChild(trash);
	row.appendChild(td);

	form.appendChild(row);
}

function trash(row) {
	row.parentNode.remove();
}

window.onload = row;

/*function submit() {
	var stocks = document.getElementsByClassName('ticker');
	var quantities = document.getElementsByClassName('quantity');

	var portfolio = new Portfolio(stocks, quantities);
	console.log(portfolio)
    const request = new XMLHttpRequest();
    request.open("POST", "/users/", true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify({"portfolio": portfolio}));
}
*/

// class Portfolio {
// 	constructor(stocks, quantities) {
// 		if (stocks.length !== quantities.length) {
// 			throw new Error('The length of stocks and quantities must be equal');
// 		}

// 		this.stocks = []
// 		for (let i = 0; i < stocks.length; i++) {
// 			this.stocks.push({
// 				symbol: stocks[i].value,
// 				quantity: quantities[i].value
// 			});
// 		}
// 	}
// }

// function caps(ticker) {
// 	var start = ticker.selectionStart;
// 	var end = ticker.selectionEnd;

// 	ticker.value = ticker.value.toUpperCase();
// 	ticker.setSelectionRange(start, end);
// }

// function check(quantity) {
// 	let n = parseInt(quantity.value);

// 	if (n < 1) {
// 		quantity.value = 1;
// 	}
// }

// function last(event) {
// 	console.log('last');
// 	if (event.keyCode !=  9) {
// 		return;
// 	}

// 	var table = document.getElementById('portfolio');
// 	var active = document.activeElement;

// 	var rows = table.children;
// 	var last = rows[rows.length - 1].children[1].children[0];

// 	if (active == last) {
// 		row();
// 	}
// }

// function row() {
// 	var table = document.getElementsByClassName('portfolio')[0];

// 	var row, td, trash, input;

// 	row = document.createElement('tr');
// 	row.setAttribute('class', 'stock');
// 		td = document.createElement('td');
// 			input = document.createElement('input');
// 				input.setAttribute('class', 'ticker');
// 				input.setAttribute('type', 'text');
// 				input.setAttribute('onkeyup', 'caps(this)');
// 				input.setAttribute('maxlength', 5);
// 		td.appendChild(input);
// 	row.appendChild(td);
// 		td = document.createElement('td');
// 			input = document.createElement('input');
// 				input.setAttribute('class', 'quantity');
// 				input.setAttribute('type', 'number');
// 				input.setAttribute('onkeyup', 'check(this)');
// 				input.setAttribute('onClick', 'check(this)');
// 		td.appendChild(input);
// 	row.appendChild(td);
// 		td = document.createElement('td');
// 			trash = document.createElement('button');
// 				trash.setAttribute('class', 'trash');
// 				trash.setAttribute('onClick', 'trash(this.parentNode)');
// 				trash.setAttribute('tabindex', -1);
// 				trash.innerText = 'X';
// 		td.appendChild(trash);
// 	row.appendChild(td);

// 	table.appendChild(row);
// }

// function trash(row) {
// 	row.parentNode.remove();
// }

// function submit() {
// 	var stocks = document.getElementsByClassName('ticker');
// 	var quantities = document.getElementsByClassName('quantity');

// 	var portfolio = new Portfolio(stocks, quantities);

// 	console.log(portfolio);
// }
