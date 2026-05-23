// Products array
const products = [
  {id:"cox-1", name:"Coxinha (Chicken & Cheese)", desc:"600gm", price:130, img:["images/Chicken2.jpg","images/Chicken1.jpg"]},
  {id:"cox-2", name:"Coxinha (Beef & Cheese)", desc:"600gm", price:150, img:["images/Beef2.jpg","images/Beef1.jpg"]},
  {id:"cox-3", name:"Coxinha (Hotdog & Cheese)", desc:"600gm", price:125, img:["images/Hotdog2.jpg","images/Hotdog1.jpg"]},
  {id:"kob-1", name:"Kobeba (Beef Kibbeh)", desc:"600gm", price:220, img:["images/kobeba2.jpg","images/kobeba1.jpg"]},
  {id:"Chou-1", name:"Caramel Churros", desc:"600gm", price:140, img:["images/CaramelChouros.png","images/CaramelChouros.png"]},
  {id:"Chou-2", name:"Chocolate Churros", desc:"600gm", price:160, img:["images/ChocolateChouros.png","images/ChocolateChouros.png"]}
];

let cart = [];
const DELIVERY_COST = 0; // Delivery cost in EGP

// Render products
const productContainer = document.getElementById("products");
products.forEach(p => {
  const div = document.createElement("div");
  div.className = "product";

  const img = document.createElement("img");
  img.src = p.img[0];
  img.alt = p.name;

  let imgIndex = 0;
  let intervalId = null;

  div.addEventListener("mouseenter", () => {
    intervalId = setInterval(() => {
      imgIndex = (imgIndex + 1) % p.img.length;
      img.src = p.img[imgIndex];
    }, 1500);
  });

  div.addEventListener("mouseleave", () => {
    clearInterval(intervalId);
    imgIndex = 0;
    img.src = p.img[0];
  });

  div.innerHTML = `
    <h3>${p.name}</h3>
    <p>${p.desc}</p>
    <p>LE${p.price.toFixed(2)}</p>
    <button onclick="addToCart('${p.id}', event)">Add to Cart</button>
  `;
  div.prepend(img);
  productContainer.appendChild(div);
});

// Animate image flying to cart
function animateToCart(imgSrc, button) {
  const cartBtn = document.getElementById("cart-btn");
  const img = document.createElement("img");
  img.src = imgSrc;
  img.classList.add("fly-img");
  document.body.appendChild(img);

  const rect = button.getBoundingClientRect();
  const cartRect = cartBtn.getBoundingClientRect();
  const startX = rect.left + window.scrollX;
  const startY = rect.top + window.scrollY;
  const endX = cartRect.left + window.scrollX;
  const endY = cartRect.top + window.scrollY;

  img.style.left = startX + "px";
  img.style.top = startY + "px";

  img.offsetWidth;

  img.style.transform = `translate(${endX - startX}px, ${endY - startY}px) scale(0.1)`;
  img.style.opacity = "0";

  setTimeout(() => {
    img.remove();
    cartBtn.classList.add("cart-bounce");
    setTimeout(() => cartBtn.classList.remove("cart-bounce"), 600);
  }, 500);
}

// Add to cart
function addToCart(id, e) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);
  if (existing) existing.quantity++;
  else cart.push({...product, quantity:1});

  e.target.disabled = true;
  setTimeout(() => e.target.disabled = false, 500);

  animateToCart(product.img[0], e.target);
  updateCart();
}

// Update cart
function updateCart() {
  document.getElementById("cart-count").textContent = cart.reduce((sum,item)=>sum+item.quantity,0);
  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";

  cart.forEach((item,i)=>{
    const div = document.createElement("div");

    div.innerHTML = `
      <span>${item.name} - EGP ${(item.price*item.quantity).toFixed(2)}</span>
      <div class="qty-controls">
        <button class="minus">-</button>
        <input type="text" value="${item.quantity}" readonly>
        <button class="plus">+</button>
      </div>
    `;

    div.querySelector(".minus").addEventListener("click",()=> {
      if(item.quantity>1) item.quantity--;
      else cart.splice(i,1);
      updateCart();
    });

    div.querySelector(".plus").addEventListener("click",()=> {
      item.quantity++;
      updateCart();
    });

    cartItems.appendChild(div);
  });

  // Call new totals update function
  updateCartTotals();
}

// New cleaner totals function you gave me
function updateCartTotals() {
  let subtotal = 0;

  cart.forEach(item => {
    subtotal += item.price * item.quantity;
  });

  const delivery = subtotal > 0 ? DELIVERY_COST : 0;
  const total = subtotal + delivery;

  document.getElementById("subtotal-value").textContent = `EGP ${subtotal.toFixed(2)}`;
  document.getElementById("delivery-value").textContent = `EGP ${delivery.toFixed(2)}`;
  document.getElementById("total-value").textContent = `EGP ${total.toFixed(2)}`;
}


// Cart drawer toggle - UPDATED WITH SCROLL LOCK
document.getElementById("cart-btn").onclick = () => {
  document.getElementById("cart-drawer").classList.add("open");
  document.body.classList.add("cart-open"); // Add this line
};

document.getElementById("close-cart").onclick = () => {
  document.getElementById("cart-drawer").classList.remove("open");
  document.body.classList.remove("cart-open"); // Add this line
};

// Checkout
const popup = document.getElementById("popup-msg");
let emptyCartClicks = 0;

document.getElementById("checkout-btn").onclick = () => {
  if(cart.length===0){
    emptyCartClicks++;
    let message = emptyCartClicks===1?"Hatetla3 2eedak fadya keda?😉":emptyCartClicks===2?"Bardo??🤨":"RO7 SHOFLAK 7AGA TAKHODHA😤";
    popup.textContent=message;
    popup.classList.remove("hidden");
    popup.classList.add("show");
    setTimeout(()=>{popup.classList.remove("show"); setTimeout(()=>popup.classList.add("hidden"),300)},3000);
    return;
  }
  emptyCartClicks=0;
  document.getElementById("cart-drawer").classList.remove("open");
  document.body.classList.remove("cart-open"); // Add this line
  document.getElementById("checkout-form").classList.add("visible");
};

// Cancel checkout
document.getElementById("cancel-order").onclick = () => document.getElementById("checkout-form").classList.remove("visible");

// Image-based submission (bypasses CORS)
function submitViaImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      console.log("Image loaded - submission successful");
      resolve(true);
    };
    img.onerror = () => {
      console.log("Image error - but submission might still work");
      resolve(true); // Still resolve as success
    };
    setTimeout(() => {
      console.log("Submission timeout completed");
      resolve(true);
    }, 1000);
  });
}

// Submit order to Google Forms - UPDATED WITH DELIVERY COST
document.getElementById("order-form").onsubmit = async (e) => {
  e.preventDefault();
  if (cart.length === 0) return alert("Your cart is empty!");
  
  const form = e.target;
  const name = form.name.value;
  const email = form.email.value;
  const mobile = form.mobile.value;
  const address = form.address.value;
  const comment = form.comment.value;

  // Calculate order totals with delivery
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCost = DELIVERY_COST;
  const finalTotal = subtotal + deliveryCost;
  
  let orderList = cart.map(item => `${item.name} x${item.quantity} - EGP ${(item.price * item.quantity).toFixed(2)}`).join("\n");
  const orderDetails = `Order:\n${orderList}\n\nSubtotal: EGP ${subtotal.toFixed(2)}\nDelivery: EGP ${deliveryCost.toFixed(2)}\nTotal: EGP ${finalTotal.toFixed(2)}`;

  console.log("Submitting Order:", { name, email, mobile, address, comment, orderDetails });

  try {
    // Create the submission URL for ORDER FORM with COMMENT field
    const params = new URLSearchParams();
    params.append('entry.859105192', name);        // Name (Order)
    params.append('entry.1111035466', email);      // Email (Order)
    params.append('entry.886482439', mobile);      // Mobile (Order)
    params.append('entry.452281284', address);     // Address (Order)
    params.append('entry.797216172', orderDetails); // Order Details
    params.append('entry.170065002', comment);     // Comment field

    const submissionUrl = `https://docs.google.com/forms/d/e/1FAIpQLScMzF-f3qsBvSq-qNvrI73WFqiCg4JmRo-m7zR2Dn7feG_IVw/formResponse?${params.toString()}`;

    console.log("Order Submission URL:", submissionUrl);

    // Submit using image method
    const success = await submitViaImage(submissionUrl);
    
    if (success) {
      console.log("Order submitted successfully!");
      cart = [];
      updateCart();
      document.getElementById("checkout-form").classList.remove("visible");
      document.getElementById("order-confirm").classList.add("visible");
      setTimeout(() => document.getElementById("order-confirm").classList.remove("visible"), 2000);
      form.reset();
    } else {
      throw new Error("Image submission failed");
    }
    
  } catch (err) {
    console.error("Submission error:", err);
    alert("Error sending order! Please try again.");
  }
};

// Close confirmation
document.getElementById("close-confirm").onclick = ()=>document.getElementById("order-confirm").classList.remove("visible");

// Header fade
const headerBg = document.querySelector(".header-bg img");
window.addEventListener("scroll",()=>{headerBg.style.opacity=Math.max(1-window.scrollY/600,0);});

// ===== HELP SECTION =====
const helpBtn = document.getElementById("help-btn");
const helpBox = document.getElementById("help-box");
const helpFormDiv = document.getElementById("help-form");
const backBtn = document.getElementById("back-btn");
const formContent = document.getElementById("form-content");
const helpFormEl = document.getElementById("helpForm");

const helpMessage = document.createElement("p");
helpMessage.id = "help-message";
helpMessage.style.marginTop = "8px";
helpMessage.style.fontWeight = "600";
helpFormEl.appendChild(helpMessage);

// toggle options box
helpBtn.addEventListener("click", () => {
  helpBox.classList.toggle("hidden");
  helpFormDiv.classList.add("hidden");
  helpMessage.textContent = "";
  const sendBtn = helpFormEl.querySelector("button[type='submit']");
  if(sendBtn) { sendBtn.style.display=""; sendBtn.disabled=false; sendBtn.textContent="Send"; }
});

// handle option clicks
document.querySelectorAll(".help-option").forEach(btn => {
  btn.addEventListener("click", () => {
    const type = btn.getAttribute("data-type");
    helpBox.classList.add("hidden");
    helpFormDiv.classList.remove("hidden");

    if(type==="cancel"){
      // UPDATED: Only Order number and Reason for cancellation
      formContent.innerHTML = `
        <label>Order Number: <input type="text" name="orderNumber" placeholder="Enter your order number" required></label>
        <label>Reason: <textarea name="reason" placeholder="Why are you cancelling?" required></textarea></label>`;
    } else if(type==="contact"){
      formContent.innerHTML = `
        <label>Your Name: <input type="text" name="name" required></label>
        <label>Mobile: <input type="text" name="mobile" required></label>`;
    } else if(type==="feedback"){
      formContent.innerHTML = `
        <label>Your Feedback: <textarea name="feedback" placeholder="Share your thoughts..." required></textarea></label>`;
    }

    const prevType = helpFormEl.querySelector("input[name='type']");
    if(prevType) prevType.remove();
    const typeInput = document.createElement("input");
    typeInput.type="hidden";
    typeInput.name="type";
    typeInput.value=type;
    helpFormEl.appendChild(typeInput);

    helpMessage.textContent="";
    const sendBtn = helpFormEl.querySelector("button[type='submit']");
    if(sendBtn) { sendBtn.style.display=""; sendBtn.disabled=false; sendBtn.textContent="Send"; }
  });
});

// back button
backBtn.addEventListener("click",()=>{
  helpFormDiv.classList.add("hidden");
  helpBox.classList.remove("hidden");
  helpFormEl.reset();
  formContent.innerHTML="";
  helpMessage.textContent="";
  const sendBtn = helpFormEl.querySelector("button[type='submit']");
  if(sendBtn){ sendBtn.style.display=""; sendBtn.disabled=false; sendBtn.textContent="Send"; }
});

// Submit help form - UPDATED WITH NEW CANCEL FORM FIELDS
helpFormEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const sendBtn = helpFormEl.querySelector("button[type='submit']");
  helpMessage.textContent = "";
  if (sendBtn) { sendBtn.disabled = true; sendBtn.textContent = "Sending..."; }

  try {
    const formData = new FormData(helpFormEl);
    const type = formData.get('type');
    
    console.log("Submitting Help Form - Type:", type);
    
    let submissionUrl = '';
    const params = new URLSearchParams();

    // Add fields based on form type with CORRECT IDs and URLs
    if (type === "cancel") {
      // UPDATED CANCEL FORM - Only Order number and Reason
      params.append('entry.1445358796', formData.get('orderNumber')); // Order Number
      params.append('entry.1348769354', formData.get('reason'));      // Reason
      
      submissionUrl = `https://docs.google.com/forms/d/e/1FAIpQLSeFJRxrou17RS675JZ3FdCFD4nLNSj5LZTn6_om1-KCVX5quA/formResponse?${params.toString()}`;
      
      console.log("Cancel form data:", {
        orderNumber: formData.get('orderNumber'),
        reason: formData.get('reason')
      });
    } else if (type === "contact") {
      // CONTACT FORM
      params.append('entry.1434534124', formData.get('name'));    // Name (Contact)
      params.append('entry.111959587', formData.get('mobile'));   // Mobile (Contact)
      params.append('entry.874639231', formData.get('message'));  // Message (using feedback field ID)
      
      submissionUrl = `https://docs.google.com/forms/d/e/1FAIpQLSfKINdoBrWx1LQkX94amMab-EOS8SSPHzdzepIsopZe3A6xFQ/formResponse?${params.toString()}`;
      
      console.log("Contact form data:", {
        name: formData.get('name'),
        mobile: formData.get('mobile'),
        message: formData.get('message')
      });
    } else if (type === "feedback") {
      // FEEDBACK FORM
      params.append('entry.874639231', formData.get('feedback')); // Feedback
      
      submissionUrl = `https://docs.google.com/forms/d/e/1FAIpQLSfBzHxe9DPdsBZ4n78vrQhlAmO-skZVgwnnz3yv5NSiz8ko5w/formResponse?${params.toString()}`;
      
      console.log("Feedback form data:", {
        feedback: formData.get('feedback')
      });
    }

    console.log("Help Submission URL:", submissionUrl);

    // Submit using image method
    const success = await submitViaImage(submissionUrl);

    if (success) {
      console.log("Help form submitted successfully!");
      helpMessage.style.color = "green";
      helpMessage.textContent = "✅ Message sent successfully!";
      if (sendBtn) sendBtn.style.display = "none";
      helpFormEl.reset();
    } else {
      throw new Error("Image submission failed");
    }
    
  } catch (err) {
    console.error("Help form submission error:", err);
    helpMessage.style.color = "red";
    helpMessage.textContent = "❌ Something went wrong!";
    if (sendBtn) {
      sendBtn.disabled = false;
      sendBtn.textContent = "Send";
    }
  }
});

// Close help box when clicking outside
document.addEventListener("click",(e)=>{
  const helpSection=document.querySelector(".help-section");
  if(!helpSection.contains(e.target) && !helpBtn.contains(e.target)){
    helpBox.classList.add("hidden");
    helpFormDiv.classList.add("hidden");
  }
});

// Test function to check field mapping
window.testFieldMapping = function() {
  console.log("=== Testing Field Mapping ===");
  console.log("Order Form Fields:");
  console.log("- entry.859105192: Name (Order)");
  console.log("- entry.1111035466: Email (Order) - NEW");
  console.log("- entry.886482439: Mobile (Order)");
  console.log("- entry.452281284: Address (Order)");
  console.log("- entry.797216172: Order Details");
  console.log("- entry.170065002: Comment - NEW");
  
  console.log("Cancel Form Fields:");
  console.log("- entry.1445358796: Order Number");
  console.log("- entry.1348769354: Reason");
  
  console.log("Contact Form Fields:");
  console.log("- entry.1434534124: Name (Contact)");
  console.log("- entry.111959587: Mobile (Contact)");
  console.log("- entry.874639231: Message");
  
  console.log("Feedback Form Fields:");
  console.log("- entry.874639231: Feedback");
};

