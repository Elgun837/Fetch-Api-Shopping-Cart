// Variables

const cartBtn = document.querySelector(".cart-btn");
const clearCarBtn = document.querySelector(".btn-clear");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".total-value");
const cartContent = document.querySelector(".cart-list");
const productsDom = document.querySelector("#products-dom");

let cart = [];
let buttonsDom = [];

class Products {
    async getProducts() {
        try {
            let result = await fetch("https://63775ada5c477765121b5746.mockapi.io/products");
            let products = await result.json();

            return products;
        } catch (error) {
            console.log(error)
        }
    }
}

class UI {
    displayProducts(products) {
        let result = "";
        products.forEach(element => {
            result += `
            <div class="col-lg-4 col-md-6">
                    <div class="product">
                        <div class="product-image">
                            <img src="${element.image}" alt="product">
                        </div>
                        <div class="product-hover">
                            <div class="product-title">${element.title}</div>
                            <div class="product-price">$ ${element.price}</div>
                            <button class="btn-add-to-cart" data-id=${element.id}>
                                <i class="fas fa-cart-shopping"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `
        });
        productsDom.innerHTML = result
    }
    getBagButtons() {
        const buttons = [...document.querySelectorAll(".btn-add-to-cart")];
        buttonsDom = buttons;

        buttons.forEach(button => {
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id);
            if (inCart) {
                button.setAttribute("disabled", "disabled");
                button.opacity = ".3";
            } else {
                button.addEventListener("click", event => {
                    event.target.disabled = true;
                    event.target.style.opacity = ".3";

                    let cartItem = { ...Storage.getProduct(id), amount: 1 };

                    cart = [...cart, cartItem];
                    Storage.saveCart(cart);
                    this.saveCartValues(cart);

                    this.addCartItem(cartItem);
                    this.showCart();

                })
            }
        })
    }
    saveCartValues(cart) {
        let tempTotal = 0;
        let itemsTotal = 0;

        cart.map(item => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        });
        cartTotal.innerText = ("$" + parseFloat(tempTotal.toFixed(2)));
        cartItems.innerHTML = itemsTotal;
    }

    addCartItem(item) {
        const li = document.createElement("li");
        li.classList.add("cart-list-item");
        li.innerHTML = `
                <div class="cart-left">
                <div class="cart-left-image">
                    <img src="${item.image}" alt="product">
                </div>
                <div class="cart-left-info">
                    <a href="#" class="cart-left-info-title">${item.title}</a>
                    <span class="cart-left-info-price">$ ${item.price}</span>
                </div>
            </div>
            <div class="cart-right">
                <div class="cart-right-quantity">
                    <button class="quantity-minus" data-id=${item.id}>
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity" data-id=${item.id}>${item.amount}</span>
                    <button class="quantity-plus" data-id=${item.id}>
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="cart-rigth-remove">
                    <button class="cart-remove-btn" data-id=${item.id}>
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        cartContent.appendChild(li);

    }
    showCart(){
        cartBtn.click();
    }
    setupApp(){
        cart = Storage.getCart();
        this.saveCartValues(cart);
        this.populateCart(cart);
    }
    populateCart(cart){
        cart.forEach(item => this.addCartItem(item))
    }
}

class Storage {
    static saveProducts(products) {
        localStorage.setItem("Products", JSON.stringify(products));
    }
    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem("Products"));

        return products.find(product => product.id === id);
    }
    static saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    static getCart(){
        return localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Products();
    ui.setupApp();
    
    products.getProducts().then(products => {
        ui.displayProducts(products)
        Storage.saveProducts(products);
    }).then(() => {
        ui.getBagButtons();
    })

    products.getProducts();
})

