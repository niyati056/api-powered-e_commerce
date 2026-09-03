const url = "https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/products.json";

let allProducts = [];

async function api() {

    const response = await fetch(url);
    allProducts = await response.json();
console.log(allProducts)
    displayCart();
}

function displayCart() {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let cards = "";

    let subtotal = 0;

    cart.forEach(cartItem => {

        let product = allProducts.find(product =>
            Number(product.id) === Number(cartItem.id)
        );

        if (!product) return;

        subtotal += (product.priceCents / 10) * cartItem.quantity;

        cards += `
            <div class="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 bg-white p-4 sm:p-5 rounded-xl border border-gray-100 shadow-sm w-full">

                <div class="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-gray-50 rounded-lg p-2 flex items-center justify-center">
                    <img src="${product.image}"
                        class="w-full h-full object-contain">
                </div>

                <div class="flex-1 text-center sm:text-left w-full">

                    <h2 class="text-base sm:text-lg font-semibold text-gray-800 line-clamp-2">
                        ${product.name}
                    </h2>

                    <p class="text-lg sm:text-xl font-bold text-purple-700 mt-1">
                        Rs.${(product.priceCents / 10).toFixed(2)}
                    </p>

                </div>

                <div class="flex items-center justify-between w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden">

                        <button onclick="decreaseQuantity(${product.id})"
                            class="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 transition font-bold text-gray-700">
                            -
                        </button>

                        <span class="px-4 font-semibold text-sm">
                            ${cartItem.quantity}
                        </span>

                        <button onclick="increaseQuantity(${product.id})"
                            class="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 transition font-bold text-gray-700">
                            +
                        </button>

                    </div>

                    <button onclick="removeItem(${product.id})"
                        class="text-red-500 hover:text-red-700 text-lg p-2 transition" title="Remove item">

                        <i class="fa-solid fa-trash"></i>

                    </button>
                </div>

            </div>
        `;
    });

    document.querySelector(".cart-items").innerHTML = cards;

    let shipping = subtotal > 0 ? 20 : 0;
    let tax = subtotal * 0.05;
    let total = subtotal + shipping + tax;

    document.getElementById("subtotal").textContent =
        "Rs." + subtotal.toFixed(2);

    document.getElementById("tax").textContent =
        "Rs." + tax.toFixed(2);

    document.getElementById("total").textContent =
        "Rs." + total.toFixed(2);
}

function increaseQuantity(id) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.forEach(item => {

        if (Number(item.id) === Number(id)) {

            item.quantity++;

        }

    });

    localStorage.setItem("cart", JSON.stringify(cart));

    displayCart();
}

function decreaseQuantity(id) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.forEach(item => {

        if (Number(item.id) === Number(id) && item.quantity > 1) {

            item.quantity--;

        }

    });

    localStorage.setItem("cart", JSON.stringify(cart));

    displayCart();
}

function removeItem(id) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart = cart.filter(item => Number(item.id) !== Number(id));

    localStorage.setItem("cart", JSON.stringify(cart));

    displayCart();
}

api();