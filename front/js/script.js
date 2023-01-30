// Fetch product list from the api and dynamically display them on the landing page

// Constants
const listOfProducts = document.getElementById("items");

// Request the list of products from the api using fetch
fetch("http://localhost:3000/api/products")

  // Parse the response as JSON if request is successful
  .then((response) => response.json())
  .then((products) => {

    for (let elt of products) {
      let productCard = `<a href="./product.html?id=${elt.id}">
        <article>
          <img src="${elt.imageUrl}" alt="${elt.altTxt}">
          <h3 class="productName">${elt.name}</h3>
          <p class="productDescription">${elt.description}</p>
        </article>
      </a>`
      listOfProducts.insertAdjacentHTML('beforeend', productCard)
    }
  })
  //  If request fails, log the error message to console and display an apology message on the page
  .catch((error) => {
    console.log("Une erreur s'est produite : ", error);

    let apologyMsg = document.createElement("h2");
    apologyMsg.innerHTML = "Impossible d'afficher le catalogue de canapés pour le moment. \
    <br>Veuillez réessayer ultérieurement!";

    apologyMsg.style.cssText = "text-align:center;width:80%;margin:auto;font-size:20px";

    listOfProducts.appendChild(apologyMsg);
  });
