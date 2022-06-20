class List {
    constructor(url, container, list = list2) {
        this.url = url;
        this.container = container;
        this.list = list;
        this.goods = [];
        this.allproducts = [];
        this.filtered = [];
        this.getJson(url);
        this.init();
    }
    getJson(url) {
        fetch(url)
            .then(text => text.json())
            .then(data => {
                this.goods = [...data];
                this.render();
            })
    }
    render() {
        let block = document.querySelector(this.container);
        for (let item of this.goods) {
            let newObj = new this.list[this.constructor.name](item);
            this.allproducts.push(newObj);
            block.insertAdjacentHTML('beforeend', newObj.render())
        }
    }
    filter(value) {
        let rule = new RegExp(value, 'i');
        this.filtered = this.allproducts.filter(item => rule.test(item.name));
        this.allproducts.forEach(item => {
            let block = document.querySelector(`.product[data-id="${item.id}"]`);

            if (!this.filtered.includes(item)) {
                block.classList.add('invisible');
            } else {
                block.classList.remove('invisible');
            }
        })
    }
    init() {
        return false;
    }
}

class ListPage extends List {
    constructor(cart, url = 'api/catalog.json', container = '.catalog') {
        super(url, container);
        this.cart = cart;
    }
    init() {
        document.querySelector(this.container).addEventListener('click', e => {
            if (e.target.classList.contains('product__btn')) {
                this.cart.toAdd(e.target);
            }
        })

        document.querySelector('.search-form').addEventListener('submit', e => {
            e.preventDefault();
            this.filter(document.querySelector('.search__input').value);
        })
    }
}

class ListCart extends List {
    constructor(url = 'api/cart.json', container = '.cart') {
        super(url, container);
    }
    init() {
        let btn = document.querySelector('.btn-cart');
        let cart = document.querySelector('.cart');
        btn.addEventListener('click', () => {
            cart.classList.toggle('invisible');
        })

        document.querySelector(this.container).addEventListener('click', e => {
            if (e.target.classList.contains('del')) {
                this.toRemove(e.target);
            }
        })
    }
    toAdd(element) {
        let find = this.allproducts.find(item => item.id == element.dataset.id);
        if (find) {
            find.quantity++;
            this.toUpdateCart(find);
        } else {
            let obj = {
                id: element.dataset.id,
                name: element.dataset.name,
                price: element.dataset.price,
                quantity: 1
            }
            this.goods = [obj];
            this.render();
        }
        let numb = +document.querySelector('.cart-number').textContent + 1;
        this.getNumberCart(numb);
        if(this.allproducts){
            document.querySelector('.cart__empty').remove();
        }
    }
    toRemove(element) {
        let find = this.allproducts.find(item => item.id == element.dataset.id);
        if (find.quantity > 1) {
            find.quantity--;
            this.toUpdateCart(find);
        } else {
            this.allproducts.splice(this.allproducts.indexOf(find), 1);
            document.querySelector(`.cart__inner[data-id="${element.dataset.id}"]`).remove();
        }
        let numb = +document.querySelector('.cart-number').textContent;
        if(numb){
            numb--
        } else {
            numb = 0;
        }
        this.getNumberCart(numb);

        if(!this.allproducts.length){
            document.querySelector('.cart').insertAdjacentHTML('afterbegin', '<p class="cart__empty">The basket is empty!</p>'); 
        }

    }
    toUpdateCart(element) {
        let block = document.querySelector(`.cart__inner[data-id="${element.id}"]`);
        block.querySelector('.cart__quantity').textContent = element.quantity;
        block.querySelector('.cart__cost').textContent = element.price * element.quantity;

    }
    getNumberCart(numb) {
        document.querySelector('.cart-number').textContent = numb;
    }
}

class Card {
    constructor(product) {
        this.id = product.id;
        this.name = product.name;
        this.price = product.price;
    }
    render() {
        return `<div class="product" data-id="${this.id}">
            <img src="img/${this.id}.jpg" alt="some_img">
            <h4>${this.name}</h4>
            <p>$${this.price.toFixed(2)} USD</p>
            <button class="product__btn" 
                data-id="${this.id}" 
                data-name="${this.name}" 
                data-price="${this.price}">
            ADD TO CART</button>
        </div>`
    }
}

class CardPage extends Card { }

class CardCart extends Card {
    constructor(product) {
        super(product);
        this.quantity = product.quantity;
    }
    render() {
        return `<div class="cart__inner" data-id="${this.id}">
        <img src="img/${this.id}.jpg" alt="some_img">
        <div class='cart__box'>
        <h4>${this.name}</h4>
        <p class="cart__quantity">Quantity: ${this.quantity}</p>
        <p class="cart__cost">Price: ${this.price * this.quantity}</p>
        <button class="del" data-id="${this.id}">X</button>
        </div>
    </div>`
    }
}


const list2 = {
    ListPage: CardPage,
    ListCart: CardCart
}
const cart = new ListCart();
const page = new ListPage(cart);

//heading
window.onscroll = function() {myFunction()};
let header = document.querySelector('.heading-fix');
let sticky = header.offsetTop;
function myFunction() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}