class List {
    constructor(url, container, list = constructorName) {
        this.url = url;
        this.container = container;
        this.list = list;
        this.goods = [];
        this.getJson(url);
        this.render();
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
            console.log(this.goods)
            let newObj = new this.list[this.constructor.name](item);
            block.insertAdjacentHTML('beforeend', newObj.render());
        }
    }
}

class ListPage extends List {
    constructor(url = 'api/catalog.json', container = '.catalog') {
        super(url, container);
        
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
        </article>`
    }
}

class CardPage extends Card { }

const constructorName = {
    ListPage: CardPage,
    // ListCart: CardCart
}

const page = new ListPage();