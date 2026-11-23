// Categories Page Script for OS ZA

async function loadCategoryImages() {
    // Fetch products safely
    const products = await fetchAllProducts();

    const categories = [
        {
            name: "Beauty & Personal Care",
            selector: ".beautyImg",
            countSelector: ".beautyCount",
            fallback: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&auto=format&fit=crop&q=80"
        },
        {
            name: "Health & Fitness",
            selector: ".healthImg",
            countSelector: ".healthCount",
            fallback: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&auto=format&fit=crop&q=80"
        },
        {
            name: "Home & Kitchen",
            selector: ".homeImg",
            countSelector: ".homeCount",
            fallback: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80"
        },
        {
            name: "Electronics & Gadgets",
            selector: ".electronicsImg",
            countSelector: ".electronicsCount",
            fallback: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"
        }
    ];

    categories.forEach(cat => {
        const matchingProducts = products.filter(p => p.category === cat.name);
        const imgEl = document.querySelector(cat.selector);
        const countEl = document.querySelector(cat.countSelector);

        if (imgEl) {
            imgEl.src = (matchingProducts.length > 0 && matchingProducts[0].image) ? matchingProducts[0].image : cat.fallback;
            imgEl.onerror = () => { imgEl.src = cat.fallback; };
        }

        if (countEl) {
            countEl.textContent = `${matchingProducts.length || '10+'} items`;
        }
    });
}

function openCategory(category) {
    localStorage.setItem("selectedCategory", category);
    window.location.href = "products.html";
}

document.addEventListener("DOMContentLoaded", () => {
    loadCategoryImages();
});
