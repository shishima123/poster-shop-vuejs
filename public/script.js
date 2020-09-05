const PRODUCT_LOAD = 4;
var watcher;

new Vue({
	el: "#app",
	data: {
		total: 0,
		products: [],
		cart: [],
		search: "cat",
		lastSearch: "",
		loading: false,
		results: [],
	},
	methods: {
		addToCart(product) {
			this.total += product.price;
			let isNotFound = true;
			for (let i = 0; i < this.cart.length; i++) {
				if (this.cart[i].id === product.id) {
					this.cart[i].qty++;
					isNotFound = false;
				}
			}
			if (isNotFound) {
				this.cart.push({
					...product,
					qty: 1,
				});
			}
		},
		increment(item) {
			item.qty++;
			this.total += item.price;
		},
		decrement(item) {
			item.qty--;
			this.total -= item.price;
			if (item.qty <= 0) {
				let index = this.cart.indexOf(item);
				this.cart.splice(index, 1);
			}
		},
		onSearch() {
			this.loading = true;
			this.products = [];
			this.results = [];
			url = "/search?q=" + this.search;
			this.$http.get(url).then(
				(response) => {
					// get body data
					setTimeout(
						function () {
							this.results = response.body;
							this.appendResult();
							this.lastSearch = this.search;
							this.loading = false;
						}.bind(this),
						1000
					);
				},
				(response) => {
					// error callback
				}
			);
		},
		appendResult() {
			if (this.products.length < this.results.length) {
				let toAppend = this.results.slice(
					this.products.length,
					this.products.length + PRODUCT_LOAD
				);
				this.products = [...this.products, ...toAppend];
			}
		},
	},
	filters: {
		currency: function (price) {
			return `$${price.toFixed(2)}`;
		},
	},
	created: function () {
		this.onSearch();
	},
	beforeUpdate: function () {
		if (watcher) {
			watcher.destroy();
			watcher = null;
		}
	},
	updated: function () {
		var sensor = document.getElementById("product-list-bottom");

		var watcher = scrollMonitor.create(sensor);

		watcher.enterViewport(this.appendResult);
	},
});
