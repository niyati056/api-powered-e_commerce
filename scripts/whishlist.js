// Wishlist Page Scripts for OS ZA

let allProducts = [];

async function initWishlistPage() {
    showWishlistSkeleton();

    // Fetch products safely
    allProducts = await fetchAllProducts();

    displayWishlist();
}

function showWishlistSkeleton() {
    const display = document.querySelector(".product-display");
    if (!display) return;

    display.innerHTML = Array(4).fill(0).map(() => `
        <div class="w-full bg-white rounded-xl border border-purple-50 p-4 shadow-sm animate-pulse flex flex-col justify-between">
            <div class="w-full h-60 bg-purple-100/50 rounded-lg mb-3"></div>
            <div class="h-4 bg-purple-100 rounded w-1/3 mb-2"></div>
            <div class="h-4 bg-purple-100 rounded w-3/4 mb-4"></div>
            <div class="flex justify-between items-center mt-3 pt-3 border-t border-purple-50">
                <div class="h-6 bg-purple-100 rounded w-20"></div>
                <div class="h-8 bg-purple-100 rounded-lg w-24"></div>
            </div>
        </div>
    `).join("");
}

function displayWishlist() {
    const display = document.querySelector(".product-display");
    const countElement = document.getElementById("wishlistCount");
    if (!display) return;

    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const wishlistProducts = allProducts.filter(p => wishlist.includes(Number(p.id)));

    if (countElement) {
        countElement.textContent = `${wishlistProducts.length} item${wishlistProducts.length === 1 ? '' : 's'} saved`;
    }

    // Toggle Clear All button
    const clearBtn = document.getElementById("clearWishlistBtn");
    if (clearBtn) {
        if (wishlistProducts.length > 0) {
            clearBtn.classList.remove("hidden");
        } else {
            clearBtn.classList.add("hidden");
        }
    }

    if (wishlistProducts.length === 0) {
        display.innerHTML = `
        <div class="col-span-full py-16 text-center bg-white rounded-2xl border border-dashed border-purple-200 p-8 shadow-xs">
            <div class="w-20 h-20 mx-auto bg-[#F5EDFF] rounded-full flex items-center justify-center text-purple-600 mb-4 text-3xl">
                <i class="fa-regular fa-heart"></i>
            </div>
            <h2 class="text-xl font-bold text-gray-800 mb-2">Your Wishlist is Empty</h2>
            <p class="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                Explore our catalog and click the heart icon to save items you love for later.
            </p>
            <a href="products.html" class="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded-xl text-sm transition shadow-sm">
                <span>Browse Products</span>
                <i class="fa-solid fa-arrow-right text-xs"></i>
            </a>
        </div>
        `;
        return;
    }

    let cards = "";
    wishlistProducts.forEach(product => {
        const price = (product.priceCents / 10).toFixed(2);

        cards += `
        <div id="wishlist-card-${product.id}" class="w-full bg-white rounded-xl border border-gray-100 hover:border-purple-200 p-4 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
            <div class="relative rounded-lg overflow-hidden bg-gray-50 h-60 flex items-center justify-center p-3 mb-3">
                <img src="${product.image}" alt="${product.name}"
                     class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                     loading="lazy"
                     onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80'">

                <button type="button" onclick="removeFromWishlist(${product.id})"
                        class="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-xs rounded-full h-8 w-8 shadow-xs flex items-center justify-center hover:scale-110 transition text-sm cursor-pointer"
                        title="Remove from Wishlist">
                    <i class="fa-solid fa-heart text-red-500"></i>
                </button>
            </div>

            <div class="flex flex-col justify-between flex-1">
                <div>
                    <span class="text-[11px] font-semibold text-purple-600 uppercase tracking-wider block mb-1">${product.category}</span>
                    <h3 class="text-sm font-semibold text-gray-800 line-clamp-2 min-h-[2.5rem] group-hover:text-purple-700 transition">
                        ${product.name}
                    </h3>
                </div>

                <div class="mt-4 pt-3 border-t border-purple-50 flex items-center justify-between">
                    <div>
                        <span class="text-[11px] text-gray-400 block leading-tight">Price</span>
                        <p class="text-base font-bold text-purple-700">Rs. ${price}</p>
                    </div>

                    <button type="button" onclick="wishlistMoveToCart(${product.id})"
                            class="bg-[#F5EDFF] hover:bg-purple-600 hover:text-white text-purple-900 font-semibold px-3.5 py-1.5 rounded-lg text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer">
                        <i class="fa-solid fa-cart-plus text-xs"></i>
                        <span>Add to Cart</span>
                    </button>
                </div>
            </div>
        </div>
        `;
    });

    display.innerHTML = cards;
}

function removeFromWishlist(id) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    wishlist = wishlist.filter(item => Number(item) !== Number(id));
    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    if (typeof updateNavBadges === "function") updateNavBadges();
    if (typeof showToast === "function") showToast("Item removed from wishlist", "info");

    displayWishlist();
}

function clearAllWishlist() {
    if (!confirm("Are you sure you want to clear your wishlist?")) return;
    localStorage.removeItem("wishlist");
    if (typeof updateNavBadges === "function") updateNavBadges();
    if (typeof showToast === "function") showToast("Wishlist cleared", "info");
    displayWishlist();
}

function wishlistMoveToCart(id) {
    if (typeof globalAddToCart === "function") {
        globalAddToCart(id);
    } else {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let existing = cart.find(item => Number(item.id) === Number(id));
        if (existing) existing.quantity++;
        else cart.push({ id: Number(id), quantity: 1 });
        localStorage.setItem("cart", JSON.stringify(cart));
        if (typeof updateNavBadges === "function") updateNavBadges();
        if (typeof showToast === "function") showToast("Moved to Cart!", "success");
    }
}

// Backward compatibility alias
function addToWishlist(id, btn) {
    removeFromWishlist(id);
}

document.addEventListener("DOMContentLoaded", () => {
    initWishlistPage();
});
