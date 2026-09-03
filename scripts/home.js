const url = "https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/products.json";

let allProducts = [];

async function api() {

    const response = await fetch(url);
    allProducts = await response.json();

    displayHomeProducts();
    displayCategories();
}


// Display Products
function displayHomeProducts() {

    const productContainer = document.querySelector(".product-display");
    if (!productContainer) return;

    let cards = "";

    const firstFourProducts = allProducts.slice(0, 4);

    firstFourProducts.forEach(product => {

        cards += `
        <div onclick="window.location.href='products.html'" class="w-full bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition flex flex-col justify-between group cursor-pointer">

            <div class="relative w-full h-48 sm:h-52 overflow-hidden flex items-center justify-center rounded-lg bg-gray-50 mb-3">
                <img src="${product.image}"
                     class="w-full h-full object-contain p-2 group-hover:scale-105 transition duration-300">
            </div>

            <div>
                <h3 class="text-sm font-semibold text-gray-800 line-clamp-2 mb-1">${product.name}</h3>
                <p class="text-base font-bold text-purple-700">Rs.${(product.priceCents / 10).toFixed(2)}</p>
            </div>

        </div>
        `;

    });

    productContainer.innerHTML = cards;
}



// Display Categories
function displayCategories() {

    const categoryContainer = document.querySelector(".cat-display");
    if (!categoryContainer) return;

    let categories = "";


    // Get unique categories
    const uniqueCategories = [
        ...new Set(allProducts.map(product => product.category))
    ];


    const firstFourCategories = uniqueCategories.slice(0, 4);


    firstFourCategories.forEach(category => {


        // Find one product image for category
        const product = allProducts.find(
            item => item.category === category
        );


        categories += `
        <div onclick="openHomeCategory('${category}')" class="w-full h-64 bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col items-center justify-between cursor-pointer hover:shadow-md hover:scale-105 transition group">

            <div class="w-full h-44 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden p-2">
                <img src="${product.image}"
                     class="h-full w-full object-contain group-hover:scale-105 transition duration-300">
            </div>

            <h3 class="font-semibold text-sm sm:text-base text-gray-800 text-center mt-2 group-hover:text-purple-600 transition">${category}</h3>

        </div>
        `;

    });


    categoryContainer.innerHTML = categories;

}

function openHomeCategory(categoryName) {
    localStorage.setItem("selectedCategory", categoryName);
    window.location.href = "products.html";
}

function addtocartview(){
    const loggedInUser = JSON.parse(localStorage.getItem("isLoggedIn"));

    if (!loggedInUser) {

        alert("Please login first.");

        window.location.href = "login.html";

        return;
    }
    
    window.location.href = "checkout.html";
}


api();