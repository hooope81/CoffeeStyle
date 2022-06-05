class List {
    constructor(url, container, list = constructorName) {
        this.url = url;
        this.container = container;
        this.list = list;
        this.goods = [];
        this.allproducts = [];
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
            block.insertAdjacentHTML('beforeend', newObj.render());
        }
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
        document.querySelector(this.container).addEventListener('click', (e) => {
            if (e.target.classList.contains('buy-btn')) {
                this.cart.toAdd(e.target);
            }
        })
    }

}

class ListCart extends List {
    constructor(url = 'api/cart.json', container = '.cart') {
        super(url, container);
        this.getCart();
    }
    getCart() {
        let cartBtn = document.querySelector('.btn-cart');
        let cartBox = document.querySelector('.cart');
        cartBtn.addEventListener('click', () => {
            cartBox.classList.toggle('invisible');
        })
    }
    toAdd(element) {
        let find = this.allproducts.find(item => item.id == element.dataset.id);
        if (find) {
            find.quantity++;
            this.toUpdateCart(find);
        } else {
            let product = {
                id: element.dataset.id,
                name: element.dataset.name,
                price: element.dataset.price,
                quantity: 1
            }
            this.goods = [product];
            this.render();
        }
    }
    toRemove(element) {
        let find = this.allproducts.find(item => item.id == element.dataset.id);
        if (find.quantity > 1) {
            find.quantity--;
            this.toUpdateCart(find);
        } else {
            let index = this.allproducts.indexOf(find);
            this.allproducts.splice(index, 1);
            document.querySelector(`.cart-box[data-id="${find.id}"]`).remove();
        }
    }
    toUpdateCart(element) {
        let block = document.querySelector(`.cart-box[data-id="${element.id}"]`);
        block.querySelector('.cart-quantity').textContent = `${element.quantity}`;
        block.querySelector('.cart-price').textContent = `${element.price * element.quantity}`;
    }
    init() {
        document.querySelector(this.container).addEventListener('click', (e) => {
            if (e.target.classList.contains('del')) {
                this.toRemove(e.target);
            }
        })
    }
}

class Card {
    constructor(product) {
        this.id = product.id;
        this.name = product.name;
        this.price = product.price;
    }
    render() {
        return `
        <article>
            <img src="img/${this.id}.jpg">
            <h4>${this.name}</h4>
            <p>${this.price}</p>
            <button class='buy-btn' data-id='${this.id}' data-name='${this.name}' data-price='${this.price}'>
            ADD TO CART</button>
        </article>`
    }
}

class CardPage extends Card { }

class CardCart extends Card {
    constructor(product) {
        super(product);
        this.quantity = product.quantity;
    }
    render() {
        return `
        <article class="cart-box" data-id="${this.id}">
            <img src="img/${this.id}.jpg">
            <div class="left-box">
            <h4>${this.name}</h4>
            <p>${this.price}</p>
            <p class="cart-quantity">${this.quantity}</p>
            </div>
            <div class="right-box">
            <h4 class="cart-price">${this.price * this.quantity}</h4>
            <div class='del' data-id='${this.id}'>X</div>
            </div>
        </article>`
    }
}


const constructorName = {
    ListPage: CardPage,
    ListCart: CardCart
}

const cart = new ListCart();
const page = new ListPage(cart);
