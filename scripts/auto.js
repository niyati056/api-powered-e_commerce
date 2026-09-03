const url = "https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/products.json";

async function loadCategoryImages() {

    const response = await fetch(url);
    const products = await response.json();

    const beauty = products.find(p => p.category === "Beauty & Personal Care");
    const health = products.find(p => p.category === "Health & Fitness");
    const home = products.find(p => p.category === "Home & Kitchen");
    const electronics = products.find(p => p.category === "Electronics & Gadgets");

    if (beauty) {
        document.querySelector(".beautyImg").src = beauty.image;
    }

    if (health) {
        document.querySelector(".healthImg").src = health.image;
    }

    if (home) {
        document.querySelector(".homeImg").src = home.image;
    }

    if (electronics) {
        document.querySelector(".electronicsImg").src = electronics.image;
    }
}

loadCategoryImages();

function openCategory(category) {

    localStorage.setItem("selectedCategory", category);

    window.location.href = "products.html";

}