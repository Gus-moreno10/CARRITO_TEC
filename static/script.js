const form = document.getElementById("product-form");
const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const quantityInput = document.getElementById("quantity");
const cartBody = document.getElementById("cart-body");
const emptyRow = document.getElementById("empty-row");
const totalElement = document.getElementById("total");
const itemCountElement = document.getElementById("item-count");
const messageElement = document.getElementById("message");

// Arreglo principal donde se almacenan temporalmente los productos del carrito.
const cart = [];

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const price = Number(priceInput.value);
    const quantity = Number(quantityInput.value);

    if (!name || price <= 0 || quantity <= 0) {
        showMessage("Ingresa un nombre, precio y cantidad validos.", true);
        return;
    }

    cart.push({ name, price, quantity });
    renderCart();
    form.reset();
    nameInput.focus();
    showMessage("Producto agregado correctamente.");
});

function renderCart() {
    cartBody.innerHTML = "";

    if (cart.length === 0) {
        cartBody.appendChild(emptyRow);
    } else {
        cart.forEach((product, index) => {
            const row = document.createElement("tr");
            const subtotal = product.price * product.quantity;

            row.innerHTML = `
                <td>${product.name}</td>
                <td>${formatCurrency(product.price)}</td>
                <td>${product.quantity}</td>
                <td>${formatCurrency(subtotal)}</td>
                <td>
                    <button class="delete-button" data-index="${index}">
                        Eliminar
                    </button>
                </td>
            `;

            cartBody.appendChild(row);
        });
    }

    updateTotal();
    updateCounter();
    bindDeleteButtons();
}

function bindDeleteButtons() {
    const deleteButtons = document.querySelectorAll(".delete-button");

    deleteButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const index = Number(button.dataset.index);
            cart.splice(index, 1);
            renderCart();
            showMessage("Producto eliminado del carrito.");
        });
    });
}

function updateTotal() {
    const total = cart.reduce((sum, product) => {
        return sum + (product.price * product.quantity);
    }, 0);

    totalElement.textContent = formatCurrency(total);
}

function updateCounter() {
    const totalProducts = cart.reduce((sum, product) => sum + product.quantity, 0);
    const label = totalProducts === 1 ? "producto" : "productos";
    itemCountElement.textContent = `${totalProducts} ${label}`;
}

function formatCurrency(value) {
    return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN"
    }).format(value);
}

function showMessage(text, isError = false) {
    messageElement.textContent = text;
    messageElement.style.color = isError ? "#c53030" : "#2f855a";
}

// Estado inicial del carrito al cargar la página.
renderCart();
