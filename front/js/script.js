// Fetch product list from the api and dynamically display them on the landing page

// Constants
const listOfProducts = document.getElementById("items");

// Request the list of products from the api using fetch
fetch("http://localhost:3000/api/products")

  // Parse the response as JSON if request is successful
  .then((response) => response.json())

  .then((products) => {

    // Browse all product and create their cards in listOfProducts section
    for (let product of products){
      
      let productLink = document.createElement("a");
      productLink.setAttribute("href", `product.html?id=${product._id}`);
      listOfProducts.appendChild(productLink);

      let productArticle = document.createElement("article");
      productLink.appendChild(productArticle);

      let productImg = document.createElement("img");
      productImg.setAttribute("src", product.imageUrl);
      productImg.setAttribute("alt", product.altTxt);
      productArticle.appendChild(productImg);

      let productName = document.createElement("h3");
      productName.classList.add("productName");
      productName.textContent = product.name;
      productArticle.appendChild(productName);

      let productDescription = document.createElement("p");
      productDescription.classList.add("productDescription");
      productDescription.textContent = product.description;
      productArticle.appendChild(productDescription);
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
