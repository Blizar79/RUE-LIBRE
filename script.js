
let cart = [];

function addToCart(name, price) {
  cart.push({
    name: name,
    price: price
  });

  updateCart();
}

function updateCart() {
  const items = document.getElementById("cart-items");
  const count = document.getElementById("cart-count");
  const total = document.getElementById("total");

  items.innerHTML = "";

  let sum = 0;

  cart.forEach((product, index) => {
    sum += product.price;

    const item = document.createElement("div");

    item.textContent =
      product.name + " - " +
      product.price.toFixed(2) + " € ";

    const remove = document.createElement("button");

    remove.textContent = "Remove";

    remove.onclick = function() {
      cart.splice(index, 1);
      updateCart();
    };

    item.appendChild(remove);
    items.appendChild(item);
  });

  if (cart.length === 0) {
    items.textContent = "Your bag is empty.";
  }

  count.textContent = cart.length;

  total.textContent = sum.toFixed(2) + " €";
}

document.getElementById("cart-button").onclick = function() {
  document.querySelector(".cart").scrollIntoView({
    behavior: "smooth"
  });
};
