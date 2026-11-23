// Home page scripts for OS ZA

let allProducts = [];

async function initHomePage() {
    showHomeSkeletons();

    // Fetch products safely using the shared fetchAllProducts
    allProducts = await fetchAllProducts();

    displayHomeProducts();
    displayHomeCategories();
}

// Skeleton loading states
function showHomeSkeletons() {
    const productContainer = document.querySelector(".product-display");
    if (productContainer) {
        productContainer.innerHTML = Array(4).fill(0).map(() => `
            <div class="w-full bg-white rounded-xl border border-purple-50 p-4 shadow-sm animate-pulse">
                <div class="w-full h-48 bg-purple-100/50 rounded-lg mb-3"></div>
                <div class="h-4 bg-purple-100 rounded w-3/4 mb-2"></div>
                <div class="h-4 bg-purple-100 rounded w-1/3 mb-4"></div>
                <div class="h-9 bg-purple-100/70 rounded-lg w-full"></div>
            </div>
        `).join("");
    }

    const catContainer = document.querySelector(".cat-display");
    if (catContainer) {
        catContainer.innerHTML = Array(4).fill(0).map(() => `
            <div class="w-full h-64 bg-white rounded-xl border border-purple-50 p-4 shadow-sm animate-pulse flex flex-col justify-between">
                <div class="w-full h-44 bg-purple-100/50 rounded-lg"></div>
                <div class="h-4 bg-purple-100 rounded w-1/2 mx-auto mt-2"></div>
            </div>
        `).join("");
    }
}

// Display 4 featured products on home
function displayHomeProducts() {
    const productContainer = document.querySelector(".product-display");
    if (!productContainer) return;

    if (!allProducts || allProducts.length === 0) {
        productContainer.innerHTML = `<p class="col-span-full text-center text-gray-500 py-8">No products found.</p>`;
        return;
    }

    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const featured = allProducts.slice(0, 4);

    let html = "";
    featured.forEach(product => {
        const isWishlisted = wishlist.includes(Number(product.id));
        const price = (product.priceCents / 10).toFixed(2);

        html += `
        <div class="w-full bg-white rounded-xl border border-purple-100/80 shadow-sm hover:shadow-md transition-all duration-300 p-4 flex flex-col justify-between group">
            <div class="relative w-full h-48 sm:h-52 overflow-hidden flex items-center justify-center rounded-lg bg-gray-50 mb-3 cursor-pointer" onclick="openProductCategory('${product.category}')">
                <img src="${product.image}" alt="${product.name}"
                     class="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                     loading="lazy"
                     onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80'">

                <button type="button" onclick="event.stopPropagation(); toggleHomeWishlist(${product.id}, this)"
                        class="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-sm rounded-full h-8 w-8 shadow-sm flex items-center justify-center hover:scale-110 transition text-sm z-10"
                        title="Wishlist">
                    <i class="${isWishlisted ? 'fa-solid text-red-500' : 'fa-regular text-gray-600'} fa-heart"></i>
                </button>
            </div>

            <div class="flex flex-col flex-1 justify-between">
                <div>
                    <span class="text-[11px] font-semibold text-purple-600 uppercase tracking-wider mb-1 block">${product.category}</span>
                    <h3 class="text-sm font-semibold text-gray-800 line-clamp-2 min-h-[2.5rem] group-hover:text-purple-700 transition"
                        onclick="openProductCategory('${product.category}')">
                        ${product.name}
                    </h3>
                </div>

                <div class="mt-3 pt-3 border-t border-purple-50 flex items-center justify-between">
                    <div>
                        <span class="text-xs text-gray-400 block">Price</span>
                        <p class="text-base font-bold text-purple-700">Rs. ${price}</p>
                    </div>

                    <button type="button" onclick="homeAddToCart(${product.id})"
                            class="bg-[#F5EDFF] hover:bg-purple-600 hover:text-white text-purple-900 font-semibold px-3 py-1.5 rounded-lg text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer">
                        <i class="fa-solid fa-cart-plus text-xs"></i>
                        <span>Add</span>
                    </button>
                </div>
            </div>
        </div>
        `;
    });

    productContainer.innerHTML = html;
}

// Display 4 Categories with images
function displayHomeCategories() {
    const categoryContainer = document.querySelector(".cat-display");
    if (!categoryContainer) return;

    const uniqueCategories = [...new Set(allProducts.map(p => p.category))];
    const topCategories = uniqueCategories.slice(0, 4);

    let html = "";
    topCategories.forEach(category => {
        const product = allProducts.find(item => item.category === category);
        const imgUrl = product ? product.image : "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&auto=format&fit=crop&q=80";

        html += `
        <div onclick="openHomeCategory('${category}')"
             class="w-full h-64 bg-white rounded-xl border border-purple-100 shadow-sm p-4 flex flex-col items-center justify-between cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all duration-300 group">

            <div class="w-full h-44 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden p-3">
                <img src="${imgUrl}" alt="${category}"
                     class="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                     loading="lazy"
                     onerror="this.src='https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&auto=format&fit=crop&q=80'">
            </div>

            <div class="w-full text-center mt-2">
                <h3 class="font-semibold text-sm sm:text-base text-gray-800 group-hover:text-purple-600 transition truncate">
                    ${category}
                </h3>
                <span class="text-xs text-purple-600 font-medium inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Explore collection &rarr;
                </span>
            </div>
        </div>
        `;
    });

    categoryContainer.innerHTML = html;
}

function openHomeCategory(categoryName) {
    localStorage.setItem("selectedCategory", categoryName);
    window.location.href = "products.html";
}

function openProductCategory(categoryName) {
    localStorage.setItem("selectedCategory", categoryName);
    window.location.href = "products.html";
}

function homeAddToCart(id) {
    if (typeof globalAddToCart === "function") {
        globalAddToCart(id);
    } else {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let existing = cart.find(item => Number(item.id) === Number(id));
        if (existing) existing.quantity++;
        else cart.push({ id: Number(id), quantity: 1 });
        localStorage.setItem("cart", JSON.stringify(cart));
        if (typeof updateNavBadges === "function") updateNavBadges();
        if (typeof showToast === "function") showToast("Added to Cart!", "success");
    }
}

function toggleHomeWishlist(id, btn) {
    if (typeof globalToggleWishlist === "function") {
        globalToggleWishlist(id, btn);
    }
}

function addtocartview() {
    window.location.href = "checkout.html";
}

// Filter from hero bottom lists
function filterByHeroItem(keyword, type) {
    if (type === "category") {
        localStorage.setItem("selectedCategory", keyword);
    } else {
        localStorage.setItem("heroSearchKeyword", keyword);
    }
    window.location.href = "products.html";
}

document.addEventListener("DOMContentLoaded", () => {
    initHomePage();
});
