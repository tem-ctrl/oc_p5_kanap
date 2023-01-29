// Displays orderId on the page. Make sure this id isn't stored anywhere.
document.getElementById("orderId").textContent = new URL(document.location).searchParams.get("id");
