// OS ZA Shared Store & Utilities

const DEFAULT_PRODUCTS = [
    {
        id: 101,
        name: "Minimalist Matte Lip Color Set",
        image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&auto=format&fit=crop&q=80",
        priceCents: 1890,
        category: "Beauty & Personal Care",
        rating: { stars: 4.8, count: 124 }
    },
    {
        id: 102,
        name: "Hydrating Rose Facial Serum & Mist",
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
        priceCents: 2450,
        category: "Beauty & Personal Care",
        rating: { stars: 4.7, count: 98 }
    },
    {
        id: 103,
        name: "Ergonomic High-Grip Yoga Mat",
        image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&auto=format&fit=crop&q=80",
        priceCents: 3200,
        category: "Health & Fitness",
        rating: { stars: 4.9, count: 215 }
    },
    {
        id: 104,
        name: "Stainless Steel Insulated Smart Bottle",
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80",
        priceCents: 1550,
        category: "Health & Fitness",
        rating: { stars: 4.6, count: 180 }
    },
    {
        id: 105,
        name: "Nordic Ceramic Coffee Cup & Saucer",
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
        priceCents: 1290,
        category: "Home & Kitchen",
        rating: { stars: 4.8, count: 86 }
    },
    {
        id: 106,
        name: "Aroma Essential Oil Ultrasonic Diffuser",
        image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=80",
        priceCents: 2790,
        category: "Home & Kitchen",
        rating: { stars: 4.5, count: 142 }
    },
    {
        id: 107,
        name: "Noise-Cancelling Wireless Bluetooth Headphones",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
        priceCents: 4990,
        category: "Electronics & Gadgets",
        rating: { stars: 4.9, count: 340 }
    },
    {
        id: 108,
        name: "Ultra-Slim Magnetic Wireless Power Bank",
        image: "https://images.unsplash.com/photo-1609592806787-3d9c5d0b47df?w=600&auto=format&fit=crop&q=80",
        priceCents: 2350,
        category: "Electronics & Gadgets",
        rating: { stars: 4.7, count: 190 }
    },
    {
        id: 109,
        name: "Botanical Nourishing Clay Face Mask",
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80",
        priceCents: 1650,
        category: "Beauty & Personal Care",
        rating: { stars: 4.6, count: 75 }
    },
    {
        id: 110,
        name: "Adjustable Cast Iron Fitness Dumbbells Set",
        image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80",
        priceCents: 4500,
        category: "Health & Fitness",
        rating: { stars: 4.8, count: 110 }
    },
    {
        id: 111,
        name: "Bamboo Minimalist Cutlery & Cooking Set",
        image: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&auto=format&fit=crop&q=80",
        priceCents: 1990,
        category: "Home & Kitchen",
        rating: { stars: 4.7, count: 95 }
    },
    {
        id: 112,
        name: "Smart Fitness Activity Tracker Watch",
        image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80",
        priceCents: 3890,
        category: "Electronics & Gadgets",
        rating: { stars: 4.6, count: 260 }
    }
];

const API_PRODUCTS_URL = "https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/products.json";

// Safe products fetcher with timeout and local fallback
async function fetchAllProducts() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);
        const response = await fetch(API_PRODUCTS_URL, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (!response.ok) throw new Error("Network response not ok");
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
            return data;
        }
        return DEFAULT_PRODUCTS;
    } catch (err) {
        console.warn("Using offline fallback products catalog:", err.message);
        return DEFAULT_PRODUCTS;
    }
}

// Global Toast Notification System
function showToast(message, type = "success") {
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        container.className = "fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    const isSuccess = type === "success";
    const isError = type === "error";
    const isInfo = type === "info";

    const bgClass = isSuccess ? "bg-gray-900 text-white border-purple-500" :
        isError ? "bg-red-600 text-white border-red-400" :
            "bg-[#F5EDFF] text-gray-900 border-purple-300";

    const icon = isSuccess ? '<i class="fa-solid fa-circle-check text-green-400 mr-2"></i>' :
        isError ? '<i class="fa-solid fa-circle-exclamation text-white mr-2"></i>' :
            '<i class="fa-solid fa-circle-info text-purple-600 mr-2"></i>';

    toast.className = `${bgClass} border shadow-xl rounded-xl px-4 py-3 text-sm font-medium flex items-center transform transition-all duration-300 translate-y-4 opacity-0 pointer-events-auto`;
    toast.innerHTML = `${icon}<span>${message}</span>`;

    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.remove("translate-y-4", "opacity-0");
        toast.classList.add("translate-y-0", "opacity-100");
    });

    // Auto remove
    setTimeout(() => {
        toast.classList.remove("translate-y-0", "opacity-100");
        toast.classList.add("translate-y-4", "opacity-0");
        setTimeout(() => toast.remove(), 300);
    }, 2800);
}

// Navigation live badges (Cart & Wishlist)
function updateNavBadges() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    const totalCartCount = cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
    const totalWishlistCount = wishlist.length;

    // Cart Badges
    document.querySelectorAll(".cart-badge").forEach(badge => {
        if (totalCartCount > 0) {
            badge.textContent = totalCartCount > 99 ? "99+" : totalCartCount;
            badge.classList.remove("hidden");
        } else {
            badge.classList.add("hidden");
        }
    });

    // Wishlist Badges
    document.querySelectorAll(".wishlist-badge").forEach(badge => {
        if (totalWishlistCount > 0) {
            badge.textContent = totalWishlistCount > 99 ? "99+" : totalWishlistCount;
            badge.classList.remove("hidden");
        } else {
            badge.classList.add("hidden");
        }
    });
}

// Synchronize Authentication across all pages
function initAuth() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    let user = null;
    try {
        user = JSON.parse(localStorage.getItem("user") || "null");
    } catch (e) {
        user = null;
    }

    const authButtons = document.getElementById("authButtons");
    const mobileAuthButtons = document.getElementById("mobileAuthButtons");
    const profile = document.getElementById("profile");
    const mobileProfile = document.getElementById("mobileProfile");
    const usernameSpan = document.getElementById("username");
    const mobileUsernameSpan = document.getElementById("mobileUsername");

    if (isLoggedIn) {
        // Completely hide Login and Sign Up buttons on desktop and mobile
        if (authButtons) {
            authButtons.style.setProperty("display", "none", "important");
            authButtons.classList.add("hidden");
            authButtons.classList.remove("md:flex", "flex");
        }
        if (mobileAuthButtons) {
            mobileAuthButtons.style.setProperty("display", "none", "important");
            mobileAuthButtons.classList.add("hidden");
            mobileAuthButtons.classList.remove("flex");
        }

        // Show User Profile & Logout button
        if (profile) {
            profile.style.setProperty("display", "flex", "important");
            profile.classList.remove("hidden");
            profile.classList.add("flex");
        }
        if (mobileProfile) {
            mobileProfile.style.setProperty("display", "flex", "important");
            mobileProfile.classList.remove("hidden");
            mobileProfile.classList.add("flex");
        }

        const displayName = (user && user.name) ? user.name : "Member";
        if (usernameSpan) usernameSpan.textContent = displayName;
        if (mobileUsernameSpan) mobileUsernameSpan.textContent = displayName;
    } else {
        // Show Login and Sign Up buttons
        if (authButtons) {
            authButtons.style.removeProperty("display");
            authButtons.classList.remove("hidden");
            authButtons.classList.add("hidden", "md:flex");
        }
        if (mobileAuthButtons) {
            mobileAuthButtons.style.removeProperty("display");
            mobileAuthButtons.classList.remove("hidden");
            mobileAuthButtons.classList.add("flex");
        }

        // Hide User Profile & Logout button
        if (profile) {
            profile.style.setProperty("display", "none", "important");
            profile.classList.add("hidden");
            profile.classList.remove("flex");
        }
        if (mobileProfile) {
            mobileProfile.style.setProperty("display", "none", "important");
            mobileProfile.classList.add("hidden");
            mobileProfile.classList.remove("flex");
        }
    }

    updateNavBadges();
}

// Authentication Functions
function signup() {
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    if (!nameInput || !emailInput || !passwordInput) return;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!name || !email || !password) {
        showToast("Please fill in all fields", "error");
        return;
    }

    if (!email.includes("@") || !email.includes(".")) {
        showToast("Please enter a valid email address", "error");
        return;
    }

    if (password.length < 6) {
        showToast("Password must be at least 6 characters", "error");
        return;
    }

    const user = { name, email, password };
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("isLoggedIn", "true");

    // Immediately trigger auth update
    initAuth();

    showToast("Account created successfully! Welcome, " + name, "success");

    setTimeout(() => {
        window.location.href = "index.html";
    }, 800);
}

function login() {
    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");

    if (!emailInput || !passwordInput) return;

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
        showToast("Please enter your email and password", "error");
        return;
    }

    let user = null;
    try {
        user = JSON.parse(localStorage.getItem("user") || "null");
    } catch (e) {
        user = null;
    }

    if (!user) {
        // If no user found, create account seamlessly
        const autoName = email.split("@")[0];
        const formattedName = autoName.charAt(0).toUpperCase() + autoName.slice(1);
        user = { name: formattedName, email, password };
        localStorage.setItem("user", JSON.stringify(user));
    }

    localStorage.setItem("isLoggedIn", "true");

    // Immediately hide login & signup buttons, show profile
    initAuth();

    showToast("Welcome back, " + (user.name || "Member") + "!", "success");

    setTimeout(() => {
        window.location.href = "index.html";
    }, 700);
}

function logout() {
    localStorage.removeItem("isLoggedIn");
    initAuth();
    showToast("Logged out successfully", "info");
    setTimeout(() => {
        window.location.href = "index.html";
    }, 600);
}

// Global mobile menu toggle
function toggleMobileMenu() {
    const menu = document.getElementById("mobileMenu");
    const icon = document.getElementById("menuIcon");
    if (!menu) return;

    if (menu.classList.contains("hidden")) {
        menu.classList.remove("hidden");
        if (icon) {
            icon.classList.remove("fa-bars");
            icon.classList.add("fa-xmark");
        }
    } else {
        menu.classList.add("hidden");
        if (icon) {
            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");
        }
    }
}

// Global add to cart helper
function globalAddToCart(id) {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
        showToast("Please login first to add items to cart", "info");
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1200);
        return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let existingItem = cart.find(item => Number(item.id) === Number(id));

    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        cart.push({ id: Number(id), quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateNavBadges();
    showToast("Added to shopping cart!", "success");
}

// Global add to wishlist helper
function globalToggleWishlist(id, btnElement) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    id = Number(id);

    const isWishlisted = wishlist.includes(id);

    if (isWishlisted) {
        wishlist = wishlist.filter(item => item !== id);
        if (btnElement) {
            btnElement.innerHTML = '<i class="fa-regular fa-heart"></i>';
        }
        showToast("Removed from wishlist", "info");
    } else {
        wishlist.push(id);
        if (btnElement) {
            btnElement.innerHTML = '<i class="fa-solid fa-heart text-red-500"></i>';
        }
        showToast("Added to wishlist!", "success");
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    updateNavBadges();
}

// Run immediately and attach event listeners
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAuth);
} else {
    initAuth();
}
window.addEventListener("load", initAuth);
window.addEventListener("storage", initAuth);
