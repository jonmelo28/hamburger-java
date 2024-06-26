const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkOutBtn = document.getElementById("check-out-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCount = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = [];

cartBtn.addEventListener("click", function(){
    updateCartModal()
    cartModal.style.display = "flex"
})

closeModalBtn.addEventListener("click", function(){
     cartModal.style.display = "none"
})

cartModal.addEventListener("click", function(event){
    if(event.target === cartModal)
    {
        cartModal.style.display = "none"
    } 
})

menu.addEventListener("click", function (event){
   let parentButton = event.target.closest(".add-to-cart-btn")

   if(parentButton){
    const name = parentButton.getAttribute("data-name")
    const price = parseFloat(parentButton.getAttribute("data-price"))

    addToCart(name, price)
   }
})

function addToCart(name, price){

  const existingItem = cart.find(item => item.name === name)



  if (existingItem )
    {
     existingItem.quantity += 1;
    }
   else
   {
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModal()
}

function updateCartModal()
{
    cartItems.innerHtml = "";
    let total = 0;


    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between"> 
          <div>
             <p class="font-medium">${item.name}</p>
             <p>${item.quantity}</p>
             <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
          </div>
          
            <button> remover </button>
        
        </div>
        `
        total += item.price * item.quantity;
        cartItems.appendChild(cartItemElement)
        

    })

    cart.forEach((element) => console.log(element));

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCount.innerHTML = cart.length;

}