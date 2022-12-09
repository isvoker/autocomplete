class Autocomplete {
	block =  null;
	dropdown = null;
	isActive = false;
	queryMinLength = 3;
	currentFocus = -1;
	params;
	input;
	checkSelected = false;

	constructor(params) {
		this.params = params;
		if (params.checkSelected) {
			this.checkSelected = params.checkSelected;
		}
		this.block = document.querySelector(`.${params.container}`);
		this.dropdown = this.block.querySelector('.autocomplete__dropdown');
		this.input = this.block.querySelector('.autocomplete__input');
		this.addListeners();
		return true;
	}

	addListeners() {
		const _ = this;

		let waiting = false;

		_.input.addEventListener('input', function(event) {
			if (!waiting) {
				waiting = true;
				setTimeout(()=> {
					_.onInput(event);
					waiting = false;
				},500)
			}
		});

		_.input.addEventListener('keydown', function(event) {
			if (_.isActive) {
				_.onKeydown(event);
			}
		});

		this.dropdown.addEventListener('click', function(event) {
			if (_.isActive) {
				_.onBlur(event);
			}
		});

		_.input.addEventListener('change', function() {
			setTimeout(()=> {
				_.checkInput()
			},300)
		});
	}

	showList(items) {
		let html = '';
		if (items.length === 0) {
			return
		}
		if (!this.params.formatter) {
			for (let item of items) {
				html += `<div class="autocomplete_item"><span>${item.name}</span></div>`
			}
		} else {
			for (let item of items) {
				html += this.params.formatter(item);
			}
		}

		if (html) {
			this.dropdown.innerHTML = html;
			this.dropdown.classList.add('active');
			this.isActive = true;
		}
	}

	hideList() {
		if (this.isActive) {
			this.dropdown.classList.remove('active');
			this.dropdown.textContent = '';
			this.isActive = false;
		}
	}

	makeItemActive() {
		const _ = this;
		const activeItem = _.dropdown.querySelector('.active');

		if (activeItem) {
			activeItem.classList.remove('active');
		}

		const items = _.dropdown.childNodes;

		if (_.currentFocus < 0) {
			_.currentFocus = items.length - 1;
		} else if (_.currentFocus >= items.length) {
			_.currentFocus = 0;
		}
		items[ _.currentFocus ].classList.add('active');
	}

	clickItem() {
		this.dropdown.childNodes[ this.currentFocus ].click();
	}

	checkInput() {
		const _ = this;
		if (_.checkSelected === false) {
			return;
		}
		if (_.input.dataset.selected === 'false') {

			if (this.params.onChange) {
				this.params.onChange(false);
			}

			Common.showError('Необходимо выбрать улицу из выпадающего списка');
			_.input.value = '';
			this.hideList();
		}
	}
	onInput(event) {
		const query = event.target.value;
		event.target.dataset.selected = 'false';
		const _ = this;
		_.hideList();

		if (query.length < this.queryMinLength) {
			return;
		}

		this.currentFocus = -1;

		Common.xhr({
			data: _.params.ajaxOption(query),
			method: 'GET',
			onSuccess: function(data) {
				if (!Common.is(data.data, 'undefined')) {
					_.showList(data.data);
				}
			}
		});
	}

	onKeydown(event) {
		if (event.keyCode === 40) { // down
			this.currentFocus++;
			this.makeItemActive();
		} else if (event.keyCode === 38) { // up
			this.currentFocus--;
			this.makeItemActive();
		} else if (event.keyCode === 13) { // enter
			if (this.currentFocus > -1) {
				Common.ignoreEvent(event);
				this.clickItem();
			}
		}
	}

	onBlur(event) {
		if (event.target.closest('.autocomplete__dropdown')) {
			this.input.value = event.target.textContent;
			this.input.dataset.selected = 'true';
			if (this.params.onSelect) {
				this.params.onSelect(event.target);
			}
			this.hideList();
		} else {
			this.hideList();
		}
	}
}
