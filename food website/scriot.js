
const foods = [
  {
    id: 1,
    name: "Margherita Pizza",
    category: "Pizza",
    price: 249,
    rating: 4.8,
    time: 25,
    restaurant: "Little Oven",
    description: "Cheese, tomato and fresh basil.",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    name: "Chicken Burger",
    category: "Burger",
    price: 199,
    rating: 4.7,
    time: 20,
    restaurant: "Burger House",
    description: "Crispy chicken with fresh vegetables.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    name: "Paneer Butter Masala",
    category: "Indian",
    price: 279,
    rating: 4.9,
    time: 30,
    restaurant: "Spice Kitchen",
    description: "Paneer in creamy tomato gravy.",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    name: "Veg Hakka Noodles",
    category: "Chinese",
    price: 169,
    rating: 4.5,
    time: 22,
    restaurant: "Wok Express",
    description: "Noodles with crunchy vegetables.",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    name: "Chocolate Cake",
    category: "Dessert",
    price: 129,
    rating: 4.9,
    time: 18,
    restaurant: "Sweet Bakery",
    description: "Rich chocolate cake.",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    name: "Chicken Biryani",
    category: "Indian",
    price: 299,
    rating: 4.8,
    time: 32,
    restaurant: "Royal Biryani",
    description: "Aromatic rice with chicken and spices.",
    image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 7,
    name: "Cheeseburger",
    category: "Burger",
    price: 229,
    rating: 4.6,
    time: 24,
    restaurant: "Burger House",
    description: "Juicy burger with melted cheese.",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 8,
    name: "Farmhouse Pizza",
    category: "Pizza",
    price: 319,
    rating: 4.6,
    time: 28,
    restaurant: "Little Oven",
    description: "Pizza topped with fresh vegetables.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 9,
    name: "Mango Cheesecake",
    category: "Dessert",
    price: 159,
    rating: 4.7,
    time: 20,
    restaurant: "Sweet Bakery",
    description: "Creamy cheesecake with mango topping.",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80"
  }
];

let cart = JSON.parse(localStorage.getItem("qbCart") || "{}");
let category = "All";
let search = "";
let under300 = false;
let topRated = false;
let sortBy = "featured";
let user = JSON.parse(localStorage.getItem("qbUser") || "null");

const $ = selector => document.querySelector(selector);

function money(value) {
  return "₹" + value;
}

function saveCart() {
  localStorage.setItem("qbCart", JSON.stringify(cart));
  updateCartCount();
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function updateCartCount() {
  const count = Object.values(cart)
    .reduce((total, quantity) => total + quantity, 0);

  $("#cartCount").textContent = count;
}

function getFilteredFoods() {
  let result = foods.filter(food => {
    const text = (
      food.name + " " +
      food.category + " " +
      food.restaurant + " " +
      food.description
    ).toLowerCase();

    return (
      (category === "All" || food.category === category) &&
      text.includes(search.toLowerCase()) &&
      (!under300 || food.price < 300) &&
      (!topRated || food.rating >= 4.5)
    );
  });

  if (sortBy === "low") {
    result.sort((a, b) => a.price - b.price);
  } else if (sortBy === "high") {
    result.sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating") {
    result.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === "time") {
    result.sort((a, b) => a.time - b.time);
  }

  return result;
}

function renderFoods() {
  const list = getFilteredFoods();

  $("#resultCount").textContent =
    `Showing ${list.length} food item(s)`;

  $("#foodGrid").innerHTML = list.map(food => `
    <article class="food-card">
      <img src="${food.image}" alt="${food.name}"
        loading="lazy">

      <div class="food-info">
        <div class="food-title">
          <h3>${food.name}</h3>
          <span class="price">${money(food.price)}</span>
        </div>

        <p class="description">${food.description}</p>

        <div class="details">
          <span class="rating">⭐ ${food.rating}</span>
          <span>⏱ ${food.time} min</span>
        </div>

        <p class="description">
          ${food.restaurant}
        </p>

        <button class="add-btn" data-add="${food.id}">
          ${cart[food.id]
            ? `✓ Added (${cart[food.id]})`
            : "+ Add to Cart"}
        </button>
      </div>
    </article>
  `).join("");
}

function setCategory(value) {
  category = value;
  renderFoods();
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  renderFoods();
  renderCart();

  const food = foods.find(item => item.id === id);
  showToast(food.name + " added to cart!");
}

function changeQuantity(id, amount) {
  cart[id] = (cart[id] || 0) + amount;

  if (cart[id] <= 0) {
    delete cart[id];
  }

  saveCart();
  renderCart();
  renderFoods();
}

function renderCart() {
  const items = Object.entries(cart)
    .map(([id, quantity]) => ({
      food: foods.find(item => item.id === Number(id)),
      quantity
    }))
    .filter(item => item.food);

  if (items.length === 0) {
    $("#cartItems").innerHTML = "<p>Your cart is empty.</p>";
  } else {
    $("#cartItems").innerHTML = items.map(item => `
      <div class="cart-item">
        <div>
          <strong>${item.food.name}</strong>
          <p>${money(item.food.price)} × ${item.quantity}</p>
          <button data-qty="${item.food.id}" data-change="-1">−</button>
          <button data-qty="${item.food.id}" data-change="1">+</button>
        </div>
        <strong>${money(item.food.price * item.quantity)}</strong>
      </div>
    `).join("");
  }

  const subtotal = items.reduce(
    (total, item) => total + item.food.price * item.quantity,
    0
  );

  const delivery = subtotal === 0 || subtotal >= 299 ? 0 : 30;

  $("#subtotal").textContent = money(subtotal);
  $("#delivery").textContent = delivery === 0 ? "FREE" : money(delivery);
  $("#total").textContent = money(subtotal + delivery);
}

// Food search
$("#searchInput").addEventListener("input", event => {
  search = event.target.value;
  renderFoods();
});

// Sort food
$("#sortSelect").addEventListener("change", event => {
  sortBy = event.target.value;
  renderFoods();
});

// Price filter
$("#priceFilter").addEventListener("click", () => {
  under300 = !under300;
  $("#priceFilter").classList.toggle("active", under300);
  renderFoods();
});

// Rating filter
$("#ratingFilter").addEventListener("click", () => {
  topRated = !topRated;
  $("#ratingFilter").classList.toggle("active", topRated);
  renderFoods();
});

// Clear filters
$("#clearFilter").addEventListener("click", () => {
  category = "All";
  search = "";
  under300 = false;
  topRated = false;
  sortBy = "featured";

  $("#searchInput").value = "";
  $("#sortSelect").value = "featured";
  $("#priceFilter").classList.remove("active");
  $("#ratingFilter").classList.remove("active");

  renderFoods();
});

// Add food to cart
$("#foodGrid").addEventListener("click", event => {
  const button = event.target.closest("[data-add]");

  if (button) {
    addToCart(Number(button.dataset.add));
  }
});

// Change quantity in cart
$("#cartItems").addEventListener("click", event => {
  const button = event.target.closest("[data-qty]");

  if (button) {
    changeQuantity(
      Number(button.dataset.qty),
      Number(button.dataset.change)
    );
  }
});

// Open and close cart
$("#cartBtn").addEventListener("click", () => {
  renderCart();
  $("#cartOverlay").classList.remove("hidden");
});

$("#closeCart").addEventListener("click", () => {
  $("#cartOverlay").classList.add("hidden");
});

// Login popup
$("#loginBtn").addEventListener("click", () => {
  $("#loginOverlay").classList.remove("hidden");
});

$("#closeLogin").addEventListener("click", () => {
  $("#loginOverlay").classList.add("hidden");
});

// Demo login
$("#loginForm").addEventListener("submit", event => {
  event.preventDefault();

  const name = $("#userName").value.trim();
  const email = $("#userEmail").value.trim();

  if (name.length < 2 || !email) {
    showToast("Please enter valid details.");
    return;
  }

  user = { name, email };
  localStorage.setItem("qbUser", JSON.stringify(user));

  $("#loginBtn").textContent = "Hi, " + name.split(" ")[0];
  $("#loginOverlay").classList.add("hidden");

  showToast("Welcome to QuickBite, " + name + "!");
});

// Demo checkout
$("#checkoutBtn").addEventListener("click", () => {
  if (Object.keys(cart).length === 0) {
    showToast("Your cart is empty!");
    return;
  }

  if (!user) {
    $("#cartOverlay").classList.add("hidden");
    $("#loginOverlay").classList.remove("hidden");
    showToast("Please log in before checkout.");
    return;
  }

  showToast("Demo order placed successfully!");

  cart = {};
  saveCart();
  renderCart();
  renderFoods();
  $("#cartOverlay").classList.add("hidden");
});

// Initial setup
if (user) {
  $("#loginBtn").textContent = "Hi, " + user.name.split(" ")[0];
}

renderFoods();
renderCart();
updateCartCount();
