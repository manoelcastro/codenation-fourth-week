const promotions = ['SINGLE LOOK', 'DOUBLE LOOK', 'TRIPLE LOOK', 'FULL LOOK'];


function getShoppingCart(ids, products) {
	const idArray = [];
	const cart = {};
	
	insertInCart.call(cart, 'products', categories, idArray, ids, products);
	insertInCart.call(cart, 'promotion', promotion, cart);
	insertInCart.call(cart, 'totalPrice', totalPrice, idArray, products, cart);
	insertInCart.call(cart, 'discountValue', discountValue, idArray, products, cart); 
	insertInCart.call(cart, 'discount', discountPercentage, idArray, products, cart);

	return cart; 
}


function insertInCart(property, fn, ...args){
	let result = fn(args);

	return this[property] = result;
}


function categories([ idArray, ids, products ]) {
	const listaProdutos = [];

	ids.forEach(id => {
		const [ produto ] = products.filter(product => product.id === id);
		const { name, category } = produto;
	
		idArray.push(products.indexOf(produto));
	
		return listaProdutos.push({ name, category });			
	});

	return listaProdutos;
}


function promotion([{ products }]){
	const categories = [];

	products.forEach(product => {
		if (!categories.includes(product.category)) {
			return categories.push(product.category);
		}
	});

	return promotions[(categories.length - 1)];
}


function totalPrice([idArray, products, cart]) {
	const totalPrice = idArray
	.map(id => {
		let arr = products[id].promotions.filter(element => element.looks.includes(cart.promotion));

		if (arr.length == 0) {
			return [{ price: products[id].regularPrice}];
		}
		return arr;
	})
	.reduce((sum, [ element ]) => sum + element.price, 0);

	return totalPrice.toFixed(2);	
}


function totalValue(idArray, products) {
	return idArray.map(id => products[id].regularPrice)
	.reduce((sum, element) => sum + element, 0);
}


function discountValue([idArray, products, cart]) {
	const regularPrice = totalValue(idArray, products);

	return (regularPrice - cart.totalPrice).toFixed(2);
}


function discountPercentage([idArray, products, cart]){
	const regularPrice = totalValue(idArray, products);

	return `${((cart.discountValue / regularPrice)*100).toFixed(2)}%`;
}

module.exports = { getShoppingCart };
