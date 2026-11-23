// Cart & Checkout scripts for OS ZA

let allProducts = [];
let appliedDiscount = 0; // Discount percentage (e.g. 10 for 10%)

async function initCartPage() {
    showCartSkeleton();

    // Fetch products safely
    allProducts = await fetchAllProducts();

    displayCart();
}

function showCartSkeleton() {
    const cartContainer = document.querySelector(".cart-items");
    if (!cartContainer) return;

    cartContainer.innerHTML = Array(2).fill(0).map(() => `
        <div class="flex flex-col sm:flex-row items-center gap-4 bg-white p-5 rounded-2xl border border-purple-50 shadow-xs animate-pulse w-full">
            <div class="w-24 h-24 bg-purple-100/50 rounded-xl flex-shrink-0"></div>
            <div class="flex-1 space-y-2 w-full">
                <div class="h-4 bg-purple-100 rounded w-2/3"></div>
                <div class="h-4 bg-purple-100 rounded w-1/4"></div>
            </div>
            <div class="h-8 bg-purple-100 rounded-lg w-28"></div>
        </div>
    `).join("");
}

function displayCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartContainer = document.querySelector(".cart-items");
    const checkoutBtn = document.getElementById("checkoutBtn");
    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = `
        <div class="bg-white rounded-2xl border border-dashed border-purple-200 p-8 sm:p-12 text-center shadow-xs">
            <div class="w-20 h-20 mx-auto bg-[#F5EDFF] rounded-full flex items-center justify-center text-purple-600 mb-4 text-3xl">
                <i class="fa-solid fa-cart-shopping"></i>
            </div>
            <h2 class="text-xl font-bold text-gray-800 mb-2">Your Shopping Cart is Empty</h2>
            <p class="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                You haven't added any products to your cart yet. Explore our curated catalog and start shopping!
            </p>
            <a href="products.html" class="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded-xl text-sm transition shadow-sm">
                <span>Browse Products</span>
                <i class="fa-solid fa-arrow-right text-xs"></i>
            </a>
        </div>
        `;

        // Update Order Summary to 0
        updateOrderSummary(0);
        if (checkoutBtn) {
            checkoutBtn.disabled = true;
            checkoutBtn.classList.add("opacity-50", "cursor-not-allowed");
            checkoutBtn.classList.remove("hover:bg-gray-800");
        }
        return;
    }

    if (checkoutBtn) {
        checkoutBtn.disabled = false;
        checkoutBtn.classList.remove("opacity-50", "cursor-not-allowed");
        checkoutBtn.classList.add("hover:bg-gray-800");
    }

    let cards = "";
    let subtotal = 0;

    cart.forEach(cartItem => {
        let product = allProducts.find(p => Number(p.id) === Number(cartItem.id));
        if (!product) return;

        let itemPrice = product.priceCents / 10;
        let itemTotal = itemPrice * cartItem.quantity;
        subtotal += itemTotal;

        cards += `
        <div class="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 hover:border-purple-200 shadow-xs transition-all w-full group">
            <div class="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-gray-50 rounded-xl p-2.5 flex items-center justify-center overflow-hidden">
                <img src="${product.image}" alt="${product.name}"
                     class="w-full h-full object-contain group-hover:scale-105 transition-transform"
                     onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80'">
            </div>

            <div class="flex-1 text-center sm:text-left w-full">
                <span class="text-[11px] font-semibold text-purple-600 uppercase tracking-wider block mb-1">${product.category}</span>
                <h3 class="text-sm sm:text-base font-bold text-gray-800 line-clamp-2">
                    ${product.name}
                </h3>
                <div class="flex items-center justify-center sm:justify-start gap-2 mt-1">
                    <p class="text-base sm:text-lg font-extrabold text-purple-700">
                        Rs. ${itemPrice.toFixed(2)}
                    </p>
                    <span class="text-xs text-gray-400">each</span>
                </div>
            </div>

            <div class="flex items-center justify-between w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                <!-- Quantity Selector -->
                <div class="flex items-center border border-purple-200 rounded-xl overflow-hidden bg-gray-50/50 shadow-2xs">
                    <button type="button" onclick="decreaseQuantity(${product.id})"
                        class="px-3 py-1.5 hover:bg-purple-100 text-gray-700 font-bold transition text-sm cursor-pointer"
                        title="Decrease">
                        -
                    </button>
                    <span class="px-4 font-bold text-sm text-gray-900 bg-white py-1">
                        ${cartItem.quantity}
                    </span>
                    <button type="button" onclick="increaseQuantity(${product.id})"
                        class="px-3 py-1.5 hover:bg-purple-100 text-gray-700 font-bold transition text-sm cursor-pointer"
                        title="Increase">
                        +
                    </button>
                </div>

                <!-- Item Total -->
                <div class="text-right hidden md:block min-w-[85px]">
                    <span class="text-[11px] text-gray-400 block">Total</span>
                    <span class="font-bold text-sm text-gray-900">Rs. ${itemTotal.toFixed(2)}</span>
                </div>

                <!-- Remove Button -->
                <button type="button" onclick="removeItem(${product.id})"
                    class="text-gray-400 hover:text-red-600 text-base p-2 rounded-lg hover:bg-red-50 transition cursor-pointer"
                    title="Remove item">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        </div>
        `;
    });

    cartContainer.innerHTML = cards;
    updateOrderSummary(subtotal);
}

function updateOrderSummary(subtotal) {
    const shipping = subtotal > 0 ? (subtotal > 999 ? 0 : 20) : 0;
    const discountAmount = subtotal * (appliedDiscount / 100);
    const tax = (subtotal - discountAmount) * 0.05;
    const total = Math.max(0, (subtotal - discountAmount) + shipping + tax);

    const subtotalEl = document.getElementById("subtotal");
    const shippingEl = document.getElementById("shipping");
    const discountEl = document.getElementById("discount");
    const taxEl = document.getElementById("tax");
    const totalEl = document.getElementById("total");

    if (subtotalEl) subtotalEl.textContent = `Rs. ${subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = shipping === 0 && subtotal > 0 ? "FREE" : `Rs. ${shipping.toFixed(2)}`;
    if (discountEl) discountEl.textContent = discountAmount > 0 ? `-Rs. ${discountAmount.toFixed(2)}` : "Rs. 0.00";
    if (taxEl) taxEl.textContent = `Rs. ${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `Rs. ${total.toFixed(2)}`;
}

function applyCoupon() {
    const input = document.getElementById("couponInput");
    const messageEl = document.getElementById("couponMessage");
    if (!input) return;

    const code = input.value.trim().toUpperCase();
    if (!code) {
        if (typeof showToast === "function") showToast("Please enter a coupon code", "error");
        return;
    }

    if (code === "OSZA10" || code === "WELCOME" || code === "SALE10") {
        appliedDiscount = 10;
        if (messageEl) {
            messageEl.textContent = "10% Discount applied successfully!";
            messageEl.className = "text-xs text-green-600 font-semibold mt-1";
        }
        if (typeof showToast === "function") showToast("10% Coupon Applied!", "success");
    } else {
        appliedDiscount = 0;
        if (messageEl) {
            messageEl.textContent = "Invalid coupon code. Try 'OSZA10'";
            messageEl.className = "text-xs text-red-500 font-semibold mt-1";
        }
        if (typeof showToast === "function") showToast("Invalid coupon code", "error");
    }

    displayCart();
}

function increaseQuantity(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.forEach(item => {
        if (Number(item.id) === Number(id)) {
            item.quantity++;
        }
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    if (typeof updateNavBadges === "function") updateNavBadges();
    displayCart();
}

function decreaseQuantity(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const item = cart.find(i => Number(i.id) === Number(id));

    if (item) {
        if (item.quantity > 1) {
            item.quantity--;
        } else {
            // Confirm before removal or remove directly
            cart = cart.filter(i => Number(i.id) !== Number(id));
            if (typeof showToast === "function") showToast("Item removed from cart", "info");
        }
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    if (typeof updateNavBadges === "function") updateNavBadges();
    displayCart();
}

function removeItem(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => Number(item.id) !== Number(id));
    localStorage.setItem("cart", JSON.stringify(cart));
    if (typeof updateNavBadges === "function") updateNavBadges();
    if (typeof showToast === "function") showToast("Item removed from cart", "info");
    displayCart();
}

function proceedToCheckout() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        if (typeof showToast === "function") showToast("Your cart is empty!", "error");
        return;
    }

    // Pass applied discount if any
    localStorage.setItem("appliedDiscount", appliedDiscount);
    window.location.href = "orderplace.html";
}

document.addEventListener("DOMContentLoaded", () => {
    initCartPage();
});
