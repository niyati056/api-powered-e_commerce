// Products Catalog Script for OS ZA

let allProducts = [];
let filteredProducts = [];

async function initProductsPage() {
    showProductsSkeleton();

    // Fetch products with fallback
    allProducts = await fetchAllProducts();
    filteredProducts = [...allProducts];

    // Check for pre-selected category from other pages (e.g. category.html or home hero)
    const selectedCategory = localStorage.getItem("selectedCategory");
    const heroSearchKeyword = localStorage.getItem("heroSearchKeyword");

    if (selectedCategory) {
        localStorage.removeItem("selectedCategory");
        // Check the matching category checkbox
        const checkboxes = document.querySelectorAll(".category");
        let found = false;
        checkboxes.forEach(cb => {
            if (cb.value.toLowerCase() === selectedCategory.toLowerCase()) {
                cb.checked = true;
                found = true;
            } else if (cb.value === "All Products") {
                cb.checked = false;
            }
        });
        if (found) {
            filteredProducts = allProducts.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
        }
    }

    if (heroSearchKeyword) {
        localStorage.removeItem("heroSearchKeyword");
        const searchInput = document.getElementById("search");
        if (searchInput) {
            searchInput.value = heroSearchKeyword;
            const kw = heroSearchKeyword.toLowerCase();
            filteredProducts = allProducts.filter(p => 
                p.name.toLowerCase().includes(kw) || 
                p.category.toLowerCase().includes(kw)
            );
        }
    }

    // Set max price slider value dynamically based on products
    setupPriceSliderRange();

    displayProducts(filteredProducts);
    setupCategoryFilters();
    setupSearch();
    setupPriceFilter();
    setupSorting();
}

function showProductsSkeleton() {
    const display = document.querySelector(".product-display");
    if (!display) return;

    display.innerHTML = Array(6).fill(0).map(() => `
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

function setupPriceSliderRange() {
    const priceRange = document.getElementById("priceRange");
    const priceValue = document.getElementById("pricevalue");
    if (!priceRange || allProducts.length === 0) return;

    // Find highest price
    const maxProductPrice = Math.max(...allProducts.map(p => Math.ceil(p.priceCents / 10)));
    const roundedMax = Math.ceil(maxProductPrice / 500) * 500 || 5000;

    priceRange.max = roundedMax;
    priceRange.value = roundedMax;
    if (priceValue) {
        priceValue.textContent = `Rs. ${roundedMax}`;
    }
}

function displayProducts(products) {
    const display = document.querySelector(".product-display");
    const productCount = document.getElementById("productCount");
    if (!display) return;

    if (productCount) {
        productCount.textContent = `Showing ${products.length} product${products.length === 1 ? '' : 's'}`;
    }

    if (products.length === 0) {
        display.innerHTML = `
        <div class="col-span-full py-16 text-center bg-white rounded-2xl border border-dashed border-purple-200 p-8">
            <div class="w-16 h-16 mx-auto bg-[#F5EDFF] rounded-full flex items-center justify-center text-purple-600 mb-4 text-2xl">
                <i class="fa-solid fa-magnifying-glass"></i>
            </div>
            <h3 class="text-lg font-bold text-gray-800 mb-1">No products match your criteria</h3>
            <p class="text-sm text-gray-500 max-w-md mx-auto mb-5">Try relaxing your search terms, price slider, or select all categories.</p>
            <button onclick="resetAllFilters()" class="bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition">
                Reset Filters
            </button>
        </div>
        `;
        return;
    }

    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    let cards = "";
    products.forEach(product => {
        const isWishlisted = wishlist.includes(Number(product.id));
        const price = (product.priceCents / 10).toFixed(2);

        cards += `
        <div class="w-full bg-white rounded-xl border border-gray-100 hover:border-purple-200 p-4 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
            <div class="relative rounded-lg overflow-hidden bg-gray-50 h-60 flex items-center justify-center p-3 mb-3">
                <img src="${product.image}" alt="${product.name}"
                     class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                     loading="lazy"
                     onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80'">

                <button type="button" onclick="addToWishlist(${product.id}, this)"
                        class="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-xs rounded-full h-8 w-8 shadow-xs flex items-center justify-center hover:scale-110 transition text-sm cursor-pointer"
                        title="${isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}">
                    <i class="${isWishlisted ? 'fa-solid text-red-500' : 'fa-regular text-gray-600'} fa-heart"></i>
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

                    <button type="button" onclick="addToCart(${product.id})"
                            class="bg-[#F5EDFF] hover:bg-purple-600 hover:text-white text-purple-900 font-semibold px-3.5 py-1.5 rounded-lg text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer">
                        <i class="fa-solid fa-cart-plus text-xs"></i>
                        <span>Add</span>
                    </button>
                </div>
            </div>
        </div>
        `;
    });

    display.innerHTML = cards;
}

// Master Filter Pipeline
function applyAllFilters() {
    let result = [...allProducts];

    // 1. Search Query
    const searchInput = document.getElementById("search");
    if (searchInput && searchInput.value.trim() !== "") {
        const query = searchInput.value.trim().toLowerCase();
        result = result.filter(p => 
            p.name.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        );
    }

    // 2. Category Checkboxes
    const checkedCheckboxes = [...document.querySelectorAll(".category:checked")].map(cb => cb.value);
    const hasAll = checkedCheckboxes.includes("All Products") || checkedCheckboxes.length === 0;

    if (!hasAll) {
        result = result.filter(p => checkedCheckboxes.includes(p.category));
    }

    // 3. Price Filter
    const priceRange = document.getElementById("priceRange");
    if (priceRange) {
        const maxPrice = Number(priceRange.value);
        result = result.filter(p => (p.priceCents / 10) <= maxPrice);
    }

    // 4. Sort
    const sort = document.getElementById("sort");
    if (sort && sort.value) {
        const val = sort.value;
        if (val === "Price: Low to High") {
            result.sort((a, b) => a.priceCents - b.priceCents);
        } else if (val === "Price: High to Low") {
            result.sort((a, b) => b.priceCents - a.priceCents);
        } else if (val === "A-Z") {
            result.sort((a, b) => a.name.localeCompare(b.name));
        } else if (val === "Z-A") {
            result.sort((a, b) => b.name.localeCompare(a.name));
        }
    }

    filteredProducts = result;
    displayProducts(filteredProducts);
}

// CATEGORY FILTERS
function setupCategoryFilters() {
    const categories = document.querySelectorAll(".category");
    categories.forEach(category => {
        category.addEventListener("change", (e) => {
            if (e.target.value === "All Products" && e.target.checked) {
                // Uncheck all other categories
                categories.forEach(cb => {
                    if (cb.value !== "All Products") cb.checked = false;
                });
            } else if (e.target.value !== "All Products" && e.target.checked) {
                // Uncheck "All Products"
                const allCb = document.querySelector(".category[value='All Products']");
                if (allCb) allCb.checked = false;
            }
            applyAllFilters();
        });
    });
}

// SEARCH
function setupSearch() {
    const searchInput = document.getElementById("search");
    if (!searchInput) return;

    searchInput.addEventListener("input", () => {
        applyAllFilters();
    });
}

function clearSearch() {
    const searchInput = document.getElementById("search");
    if (searchInput) {
        searchInput.value = "";
        applyAllFilters();
    }
}

// PRICE FILTER
function setupPriceFilter() {
    const priceRange = document.getElementById("priceRange");
    const priceValue = document.getElementById("pricevalue");
    if (!priceRange) return;

    priceRange.addEventListener("input", () => {
        const maxPrice = Number(priceRange.value);
        if (priceValue) {
            priceValue.textContent = `Rs. ${maxPrice}`;
        }
        applyAllFilters();
    });
}

// SORTING LOGIC
function setupSorting() {
    const sort = document.getElementById("sort");
    if (!sort) return;

    sort.addEventListener("change", () => {
        applyAllFilters();
    });
}

// Reset all filters
function resetAllFilters() {
    const searchInput = document.getElementById("search");
    if (searchInput) searchInput.value = "";

    const categories = document.querySelectorAll(".category");
    categories.forEach(cb => {
        cb.checked = (cb.value === "All Products");
    });

    const priceRange = document.getElementById("priceRange");
    const priceValue = document.getElementById("pricevalue");
    if (priceRange) {
        priceRange.value = priceRange.max;
        if (priceValue) priceValue.textContent = `Rs. ${priceRange.max}`;
    }

    const sort = document.getElementById("sort");
    if (sort) sort.value = "";

    applyAllFilters();
}

// WISHLIST FUNCTION
function addToWishlist(id, button) {
    if (typeof globalToggleWishlist === "function") {
        globalToggleWishlist(id, button);
    } else {
        let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        id = Number(id);
        if (wishlist.includes(id)) {
            wishlist = wishlist.filter(item => item !== id);
            button.innerHTML = `<i class="fa-regular text-gray-600 fa-heart"></i>`;
        } else {
            wishlist.push(id);
            button.innerHTML = `<i class="fa-solid fa-heart text-red-500"></i>`;
        }
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        if (typeof updateNavBadges === "function") updateNavBadges();
    }
}

// CART FUNCTION
function addToCart(id) {
    if (typeof globalAddToCart === "function") {
        globalAddToCart(id);
    } else {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let existingItem = cart.find(item => Number(item.id) === Number(id));
        if (existingItem) existingItem.quantity++;
        else cart.push({ id: Number(id), quantity: 1 });
        localStorage.setItem("cart", JSON.stringify(cart));
        if (typeof updateNavBadges === "function") updateNavBadges();
        if (typeof showToast === "function") showToast("Added to Cart!", "success");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initProductsPage();
});
