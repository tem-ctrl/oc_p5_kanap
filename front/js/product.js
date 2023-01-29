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

    let productImg = document.createElement("img");
    productImg.setAttribute("src", productData.imageUrl);
    productImg.setAttribute("alt", productData.altTxt);
    productImgContainer.appendChild(productImg);

    productName.textContent = productDataName;
    productPrice.textContent = productData.price;
    productDescription.textContent = productData.description;

    // let productDataColors = productData.colors;
    for (let color of productData.colors) {
      let colorOption = document.createElement("option");
      colorOption.setAttribute("value", color);
      colorOption.textContent = color;
      productColors.appendChild(colorOption);
    }
  })
  
  .catch((error) => {
    console.log("Une erreur s'est produite : ",  error);
    productSection.removeChild(productArticle);

    let apologyMsg = document.createElement("h2");
    apologyMsg.innerHTML = "Impossible d'afficher le canapé sélectionné pour le moment. \
    <br>Veuillez réessayer ultérieurement!";
    apologyMsg.style.cssText = "text-align:center; width:80%; margin-:auto;";
    productSection.appendChild(apologyMsg);
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
  if (cart !== null) {
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
