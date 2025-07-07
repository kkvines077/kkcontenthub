const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 1999,
    image: "assets/images/headphones.jpg"
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 2499,
    image: "assets/images/watch.jpg"
  },
  {
    id: 3,
    name: "Bluetooth Speaker",
    price: 1499,
    image: "assets/images/speaker.jpg"
  }
];

window.onload = () => {
  const list = document.getElementById("product-list");
  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "product-card";
    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}" width="150"><br>
      <strong>${p.name}</strong><br>
      ₹${p.price}<br>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
      <a href="product.html?id=${p.id}">View Details</a>
    `;
    list.appendChild(div);
  });
};

function addToCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(id);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Product added to cart!");
}
