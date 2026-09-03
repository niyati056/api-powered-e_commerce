const url = "https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/products.json";

let allProducts = [];
let currentProducts = [];

async function api() {

    const response = await fetch(url);

    const data = await response.json();

    allProducts = data;
    currentProducts = allProducts;

    let selectedCategory = localStorage.getItem("selectedCategory");

    if (selectedCategory) {

        currentProducts = allProducts.filter(product =>
            product.category === selectedCategory
        );

        localStorage.removeItem("selectedCategory");

    }

    displayProducts(currentProducts);

    setupCategoryFilters();
    setupSearch();
    setupPriceFilter();
    setupSorting();

}


function displayProducts(products) {

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    let cards = "";

    products.forEach(product => {

        let isWishlisted = wishlist.includes(Number(product.id));


        cards += `
        <div class="w-full bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between">

            <div class="relative rounded-lg overflow-hidden bg-gray-50 h-64 flex items-center justify-center p-2">

                <img src="${product.image}"
                class="w-full h-full object-contain">


                <button onclick="addToWishlist(${product.id}, this)"
                class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full h-9 w-9 shadow flex items-center justify-center hover:scale-110 transition">

                <i class="${isWishlisted ? 'fa-solid text-red-500' : 'fa-regular'} fa-heart"></i>

                </button>

            </div>


            <div class="mt-4 flex flex-col justify-between flex-1">

                <h3 class="text-base font-semibold text-gray-800 line-clamp-2 min-h-[3rem]">
                    ${product.name}
                </h3>


                <p class="text-lg font-bold text-purple-700 mt-2">
                    Rs.${(product.priceCents / 10).toFixed(2)}
                </p>


                <button onclick="addToCart(${product.id})"
                class="w-full mt-4 bg-[#F5EDFF] py-2.5 rounded-lg hover:bg-[#eadcff] font-medium text-sm transition">

                Add to Cart

                </button>

            </div>

        </div>
        `;

    });


    document.querySelector(".product-display").innerHTML = cards;

}



// CATEGORY FILTER

function setupCategoryFilters() {

    const categories = document.querySelectorAll(".category");


    categories.forEach(category => {


        category.addEventListener("change", () => {


            let checkedCategories =
                [...document.querySelectorAll(".category:checked")]
                    .map(item => item.value);



            if (
                checkedCategories.length === 0 ||
                checkedCategories.includes("All Products")
            ) {

                currentProducts = allProducts;

            }

            else {

                currentProducts = allProducts.filter(product =>

                    checkedCategories.includes(product.category)

                );

            }


            displayProducts(currentProducts);


        });


    });

}




// SEARCH

function setupSearch() {

    const searchInput = document.getElementById("search");


    searchInput.addEventListener("input", () => {


        let text = searchInput.value.toLowerCase();



        currentProducts = allProducts.filter(product =>

            product.name.toLowerCase().includes(text)

        );


        displayProducts(currentProducts);


    });


}




// PRICE FILTER

function setupPriceFilter() {

    const priceRange = document.getElementById("priceRange");

    const priceValue = document.getElementById("pricevalue");



    priceRange.addEventListener("input", () => {


        let maxPrice = Number(priceRange.value);


        priceValue.textContent = `$${maxPrice}`;



        currentProducts = allProducts.filter(product =>

            product.priceCents / 100 <= maxPrice

        );


        displayProducts(currentProducts);


    });

}




// SORTING LOGIC

function setupSorting() {

    const sort = document.getElementById("sort");


    sort.addEventListener("change", () => {


        let value = sort.value;



        let sortedProducts = [...currentProducts];



        if (value === "Price: Low to High") {


            sortedProducts.sort((a, b) =>

                a.priceCents - b.priceCents

            );


        }



        else if (value === "Price: High to Low") {


            sortedProducts.sort((a, b) =>

                b.priceCents - a.priceCents

            );


        }



        else if (value === "A-Z") {


            sortedProducts.sort((a, b) =>

                a.name.localeCompare(b.name)

            );


        }



        else if (value === "Z-A") {


            sortedProducts.sort((a, b) =>

                b.name.localeCompare(a.name)

            );


        }



        displayProducts(sortedProducts);


    });

}






// WISHLIST

function addToWishlist(id, button) {


    let wishlist =
        JSON.parse(localStorage.getItem("wishlist")) || [];


    id = Number(id);



    if (wishlist.includes(id)) {


        wishlist = wishlist.filter(item => item !== id);


        button.innerHTML =
            `<i class="fa-regular fa-heart"></i>`;

    }


    else {


        wishlist.push(id);


        button.innerHTML =
            `<i class="fa-solid fa-heart text-red-500"></i>`;

    }



    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );

}



// CART
function addToCart(id) {

    const loggedInUser = JSON.parse(localStorage.getItem("isLoggedIn"));

    if (!loggedInUser) {

        alert("Please login first.");

        window.location.href = "login.html";

        return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let existingItem = cart.find(item => Number(item.id) === Number(id));

    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({
            id: id,
            quantity: 1
        });

    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Product added to cart successfully!");

}



api();