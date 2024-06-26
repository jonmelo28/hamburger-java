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
          
            <button class="remove-from-cart-btn" data-name="${item.name}"> remover </button>
        
        </div>
        `
        total += item.price * item.quantity;
        cartItems.appendChild(cartItemElement)
        

    })

   // cart.forEach((element) => console.log(element));

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCount.innerHTML = cart.length;

}

//remove item do carrinho
cartItems.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name =event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

function removeItemCart(name){
   const index = cart.findIndex(item =>item.name === name);

   if(index !== -1){
       const item = cart[index];

       if(item.quantity > 1){
        item.quantity -= 1;
        updateCartModal();
        return;
       }

       cart.splice(index, 1);
       updateCartModal();
   }
}

addressInput.addEventListener("input", function(event){
   let inputValue = event.target.value;

   if(inputValue !== ""){
    addressInput.classList.remove("border-red-500")
    addressWarn.classList.add("hidden")
   }
})

checkOutBtn.addEventListener("click", function(){

    const isOpen = checkRestauranteOpen();
    if(!isOpen){
       
       Toastify({
        text: "Restaurante fechado no momento!",
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#ef4444",
        },
       }).showToast();
        return;
    }

    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    //enviar para API do whatsapp
    const cartItems = cart.map((item) => {
        return (`${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`)
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "+557981133883"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart = [];
    updateCartModal();
})

//verifica a hora e manipula o card de horario
function checkRestauranteOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 24;
}

const spanItem = document.getElementById("date-span")
const isOpen =checkRestauranteOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}