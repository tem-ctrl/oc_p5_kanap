/*!
* Cart management: add, remove article,
* modify article quantities, calculate total price,
* fill contact form and place order.
*/

// retrieve DOM elements to be manipulated
// const cartSection = document.getElementById("cart");
const cartItems = document.getElementById("cart__items");
const cartHeading = document.querySelector("h1");
const totalDisplay = document.querySelector(".cart__price p");
const orderForm = document.querySelector(".cart__order");
const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
const addressErrorMsg = document.getElementById("addressErrorMsg");
const cityErrorMsg = document.getElementById("cityErrorMsg");
const emailErrorMsg = document.getElementById("emailErrorMsg");
const totalProductsQuantity = document.getElementById("totalQuantity");
const totalPrice = document.getElementById("totalPrice");

// get cart from localStorage and initialize total price to 0
var cart = getCart();
const apiUrlPost = "http://localhost:3000/api/products/order";

// fetch all product in cart and display them on cart page
for (let product of cart) {
 
  // get product id, color and quantity
  let productId = product.id;
  let productColor = product.color;
  let productQuantity = product.quantity;
  let apiUrlGet = `http://localhost:3000/api/products/${productId}`;

  fetch(apiUrlGet)
   
  // if request succeeds
    .then((response) => response.json())
    .then((productData) => {
     
      // create product article tag with suitable attributes into itemList section
      let productArticle = document.createElement("article");
      productArticle.classList.add("cart__item");
      productArticle.setAttribute("data-id", productId);
      productArticle.setAttribute("data-color", productColor);
      cartItems.appendChild(productArticle);
     
      // create product image container as div tag inside product article
      let productImgContainer = document.createElement("div");
      productImgContainer.classList.add("cart__item__img");
      productArticle.appendChild(productImgContainer);

      // add img tag into image container
      let productImg = document.createElement("img");
      productImg.setAttribute("src", productData.imageUrl);
      productImg.setAttribute("alt", productData.altTxt);
      productImgContainer.appendChild(productImg);
     
      // product content div
      let productContent = document.createElement("div");
      productContent.classList.add("cart__item__content");
      productArticle.appendChild(productContent);
     
      // product content description as div tag
      let productContentDescription = document.createElement("div");
      productContentDescription.classList.add("cart__item__content__description");
      productContent.appendChild(productContentDescription);
   
      // product name in h2 tag
      let productName = document.createElement("h2");
      productName.textContent = productData.name;
      productContentDescription.appendChild(productName);
     
      // create p tag for product color
      let choosedProductColor = document.createElement("p");
      choosedProductColor.textContent = productColor;
      productContentDescription.appendChild(choosedProductColor);
     
      // another p tag for product price
      let productPrice = document.createElement("p");
      productPrice.textContent = `${productData.price} €`;
      productContentDescription.appendChild(productPrice);
     
      // create product content settings div
      let productContentSettings = document.createElement("div");
      productContentSettings.classList.add("cart__item__content__settings");
      productContent.appendChild(productContentSettings);
     
      // product quantity settings div
      let productQuantitySettings = document.createElement("div");
      productQuantitySettings.classList.add("cart__item__content__settings__quantity");
      productContentSettings.appendChild(productQuantitySettings);
     
      // p tag to hold product quantity input label
      let ProductQuantityInputLabel = document.createElement("p");
      ProductQuantityInputLabel.textContent = "Qté : ";
      productQuantitySettings.appendChild(ProductQuantityInputLabel);

      // product quantity input
      let productQuantityInput = document.createElement("input");

        let attrObj = {
        "type": "number",
        "name": "itemQuantity",
        "min": 1,
        "max": 100,
        "value": productQuantity
      };

      // add attributes and their values
      for (let attr of Object.keys(attrObj)){
        productQuantityInput.setAttribute(attr, attrObj[attr]);
      }
      productQuantityInput.classList.add("itemQuantity");
      productQuantitySettings.appendChild(productQuantityInput);
     
      // div tag to contain paragraph with text "Supprimer"
      let removeProduct = document.createElement("div");
      removeProduct.classList.add("cart__item__content__settings__delete");
      productContentSettings.appendChild(removeProduct);
     
      // create p tag for text "supprimer"
      let removeProductText = document.createElement("p");
      removeProductText.classList.add("deleteItem");
      removeProductText.textContent = "Supprimer";
      removeProduct.appendChild(removeProductText);
      
      updateCartDisplay();

      // listen for click on this text, to remove the product from cart
      removeProductText.addEventListener("click", () => {
        removeFromCart(product);
        productArticle.remove();
        updateCartDisplay();
      });
     
      // listen to changes on product quantity input
      productQuantityInput.addEventListener("change", () => {
        if (Number(productQuantityInput.value) <= 0){
          let product = productQuantityInput.closest(".cart__item").dataset;
          productQuantityInput.closest(".cart__item").remove();
          removeFromCart(product);
        }
        updateCartDisplay();
      });
    })
   
    // if request fails
    .catch((error) => {
      console.log("Une erreur s'est produite : ", error);
      let cartErrorMsg = document.createElement("h2");
      cartErrorMsg.textContent = "L'article sélectionné n'est pas disponible pour le moment.";
      cartErrorMsg.style.cssText = "text-align:center;padding:15px;";
      cartItems.appendChild(cartErrorMsg);
     
      totalDisplay.textContent = "Impossible de passer la commande, veuillez réessayer ultérieurement";
      totalDisplay.style.textAlign = "center";
      orderForm.style.display = "none";
    });
}

// if cart is empty
if (cart.length === 0) {
  displayEmptyCart();
}


let form = document.querySelector(".cart__order__form");
let submitButton = document.getElementById("order");

// add event listeners to form fields to check the validity of their values
form.firstName.setAttribute("placeholder", "Exemple : Paul");
form.firstName.addEventListener("input", () => {
  isValidName(form.firstName, firstNameErrorMsg);
});

form.lastName.setAttribute("placeholder", "Exemple : Kamga");
form.lastName.addEventListener("input", () => {
  isValidName(form.lastName, lastNameErrorMsg);
});

form.address.setAttribute("placeholder", "Exemple : 225 Rue Martin Paul Samba");
form.address.addEventListener("input", () => {
  isValidAddress(form.address, addressErrorMsg);
});

form.city.setAttribute("placeholder", "Exemple : 83901 Yaoundé");
form.city.addEventListener("input", () => {
  isValidCityName(form.city, cityErrorMsg);
});

form.email.setAttribute("placeholder", "Exemple : exemple@email.com");
form.email.addEventListener("input", () => {
  isValidEmail(form.email, emailErrorMsg);
});

let products = [];

for (let product of cart) {
  products.push(product.id);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
 
  let contact = {
    firstName: form.firstName.value,
    lastName: form.lastName.value,
    address: form.address.value,
    city: form.city.value,
    email: form.email.value,
  };
 
  fetch(apiUrlPost, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({contact, products})
  })
   
    .then((response) => response.json())
   
    .then((orderDetails) => {
      console.log("Formulaire envoyé avec succès!!!");
     
      let orderId = orderDetails.orderId;
      let confirmationUrl = `confirmation.html?id=${orderId}`;

      console.log(orderId);
      if (orderId) {

        // open confirmation page
        window.location.href = confirmationUrl;

        // clear cart
        localStorage.clear()
      } else {
        alert("La commande n'a pas abouti. Veuillez reessayer ultérieurement!!!")
      }
    })
    .catch((error) => {
      console.log("Une erreur s'est produite : ", error);
    });
});


/* functions */

/**
 * Save cart array to localStorage as array of objects
 * @param  {Array} cart - list of products in cart
 */
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/**
 * Retrieve cart array from localStorage
 * @returns {Array} cart
 */
function getCart() {
  let cart = localStorage.getItem("cart");
  // return cart as array of objects (products) if not empty
  if (cart !== null) {
    return JSON.parse(cart);
  } else {
    //  otherwise return empty array
    return [];
  }
}

/**
 * Get cart, remove given product, save it back to localStorage and reload the window
 * @param  {Object} product product to be banned from cart
 */
function removeFromCart(product) {
  let cart = getCart();
  // keep only products with id and color different from those of the product to remove
  cart = cart.filter((p) => p.id !== product.id || p.color !== product.color);
  saveCart(cart);
}


/**
 * Update total price and total quantity when new produict added, removed or quantity changed
 */
function updateCartDisplay() {
  let items = document.querySelectorAll('.cart__item');
  if (items.length === 0) {
    displayEmptyCart();
    return
  } else {
    let totalCartPrice = 0;
    let totalQuantity = 0;
    for (let item of items) {
      let quantity = Number(item.lastChild.lastChild.firstChild.lastChild.value);
      totalQuantity += quantity;
      totalCartPrice += quantity * Number(item.lastChild.firstChild.lastChild.textContent.split(" ")[0]);
    }

    totalProductsQuantity.textContent = totalQuantity;
    totalPrice.textContent = totalCartPrice;
  }
}

/**
 * Alternative to cart elements when cart is empty
 */
function displayEmptyCart() {
  cartItems.style.display = "none";
  cartHeading.textContent = "Votre panier est vide !";
  totalDisplay.innerHTML = '<a href="index.html#items" style="color:#fff" onmouseover="changeColor(this)"\
   onmouseout="colorWhite(this)">Consulter nos produits</a>';
  totalDisplay.style.cssText = "text-align:center;font-size:24px";
  orderForm.style.display = "none";
}

// Handle :hover on product list link
let changeColor = (elt) => {
  elt.style.color = "#2a12ce";
}

let colorWhite = (elt) => {
  elt.style.color = "#fff";
}

/**
 * Check name and surname validity according to specified pattern
 * @param  {String} input
 * @param  {HTMLElement} nextElt
 */
function isValidName(input, nextElt) {
  let nameRegex = /^[a-zéèôöîïûùü' -]{2,50}$/gi;
  // test if input matches pattern
  if (nameRegex.test(input.value)) {
    nextElt.textContent = "Nom/Prénom valide";
  } else {
    nextElt.textContent = "Vous ne pouvez utiliser que des lettres, espaces, - et ' ";
  }
}

/**
 * Check city name validity according to specified pattern
 * @param  {String} input
 * @param  {HTMLElement} nextElt
 */
function isValidCityName(input, nextElt) {
  let cityRegex = /^[0-9]{5}[a-zéèôöîïûùü' -]{2,50}$/gi;
  // if input matches pattern
  if (cityRegex.test(input.value)) {
    nextElt.textContent = "Code postal, Ville valide";
  } else {
    nextElt.textContent = "Erreur! format attendu:  code postal (5 chiffres) nom de la ville. Exemple : 83901 Yaoundé";
  }
}

/**
 * Check address validity according to specified pattern
 * @param  {String} input
 * @param  {HTMLElement} nextElt
 */
function isValidAddress(input, nextElt) {
  let adressRegex = /^[a-z0-9éèôöîïûùü' -,]{2,50}$/gi;
  if (adressRegex.test(input.value)) {
    nextElt.textContent = "Adresse valide";
  } else {
    nextElt.textContent = "Vous ne pouvez utiliser que des chiffres, lettres, espaces, - et ' ";
  }
}

/**
 * Check text validity according to specified pattern
 * @param  {String} input
 * @param  {HTMLElement} nextElt
 */
function isValidEmail(input, nextElt) {
  // gmail-like addresses pattern
  let emailRegex = /^[a-z0-9.-_]{2,30}[@]{1}[a-z0-9.-_]{2,30}[.]{1}[a-z-]{2,30}$/gi;
  if (emailRegex.test(input.value)) {
    nextElt.textContent = "adresse email valide";
  } else {
    nextElt.textContent = "Erreur! Format attendu: exemple@email.com";
  }
}
