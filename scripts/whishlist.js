
const url = "https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/products.json";
console.log("wishlist.js loaded");

let allProducts = [];

async function api() {

    const response = await fetch(url);
    allProducts = await response.json();

    console.log(allProducts); // Should NOT be undefined

    displayWishlist();
}
function displayProducts(products) {

    let cards = "";

    products.forEach(product => {

        cards += `
            <div class="w-full bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between">

                <div class="relative rounded-lg overflow-hidden bg-gray-50 h-64 flex items-center justify-center p-2">

                    <img src="${product.image}"
                        class="w-full h-full object-contain">

                    <button onclick="addToWishlist(${product.id}, this)"
    class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full h-9 w-9 shadow flex items-center justify-center hover:scale-110 transition">

<i class="${JSON.parse(localStorage.getItem('wishlist'))?.includes(Number(product.id))
    ? 'fa-solid text-red-500'
    : 'fa-regular'} fa-heart"></i>
</button>

                </div>

                <div class="mt-4 flex flex-col justify-between flex-1">

                    <h3 class="text-base font-semibold text-gray-800 line-clamp-2 min-h-[3rem]">
                        ${product.name}
                    </h3>

                    <p class="text-lg font-bold text-purple-700 mt-2">
                        Rs.${(product.priceCents / 10).toFixed(2)}
                    </p>

                    <button class="w-full mt-4 bg-[#F5EDFF] py-2.5 rounded-lg hover:bg-[#eadcff] font-medium text-sm transition">
                        Add to Cart
                    </button>

                </div>

            </div>
        `;
    });

    document.querySelector(".product-display").innerHTML = cards;
}
function displayWishlist() {

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

   let wishlistProducts = allProducts.filter(product =>
    wishlist.includes(Number(product.id))
);
    console.log(wishlist);
console.log(allProducts[0]);

    console.log(wishlistProducts);

    displayProducts(wishlistProducts);
}

api();