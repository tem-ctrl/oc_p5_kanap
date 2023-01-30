// Retrieve product id, fetch that product's info from the api the dispaly it on product page

// Get useful DOM elements
const pageTitle = document.querySelector('title');
const productSection = document.querySelector(".item");
const productArticle = document.querySelector("article");
const productImgContainer = document.querySelector(".item__img");
const productName = document.getElementById("title");
const productPrice = document.getElementById("price");
const productDescription = document.getElementById("description");
const productColors = document.getElementById("colors");

const addToCartButton = document.getElementById("addToCart");
var quantity = document.getElementById("quantity");

let productId = new URL(document.location).searchParams.get("id");

// Fetch product data
fetch(`http://localhost:3000/api/products/${productId}`)

  .then((response) => response.json())

  .then((productData) => {

    let productDataName = productData.name;
    pageTitle.textContent = productDataName;

    productImgContainer.insertAdjacentHTML('beforeend', `<img src="${productData.imageUrl}" alt="${productData.altTxt}">`)

    productName.textContent = productDataName;
    productPrice.textContent = productData.price;
    productDescription.textContent = productData.description;

    // Add color options
    for (let color of productData.colors) {
      let colorOption = `<option value="${color}">${color}</option>`
      productColors.insertAdjacentHTML('beforeend', colorOption)
    }
  })

  .catch((error) => {
    console.log("Une erreur s'est produite : ", error);
    productSection.removeChild(productArticle);
    productSection.insertAdjacentHTML('beforeend', `<h2 style="text-align:center;width:80%;margin:auto;">
    Impossible d'afficher le canapé sélectionné pour le moment. <br>Veuillez réessayer ultérieurement!</h2>`)
  });

// Get updated list of product colors
let colors = document.getElementById("colors");

// Listen to any click on addToCardButton and perform appropriate actions
addToCartButton.addEventListener("click", () => {

  let choosedColor = colors.value;
  let choosedQuantity = Number(quantity.value);
  let product = {
    id: productId,
    quantity: choosedQuantity,
    color: choosedColor
  };

  if (choosedColor !== "" && choosedQuantity > 0 && choosedQuantity <= 100) {
    addToCart(product);
    alert("Votre article a bien été ajouté au panier.");
  } else {
    alert("Veuillez sélectionner une couleur et indiquer la quantité souhaitée entre 1 et 100 articles.");
  }
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
  if (cart) {
    return JSON.parse(cart);
  } else {
    //  otherwise return empty array
    return [];
  }
}


/**
 * Append product to cart array and save cart back to localStorage
 * @param  {} product
 */
function addToCart(product) {
  let cart = getCart();
  // search for given product in cart
  let productInCart = cart.find((p) => p.id === product.id && p.color === product.color);
  // update product quantity if product exists in cart
  if (productInCart) {
    productInCart.quantity += product.quantity;
    // otherwise append product to cart array
  } else {
    cart.push(product);
  }
  saveCart(cart);
}
