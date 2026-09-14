
document.addEventListener("DOMContentLoaded",()=>{
  // Gentle reveal for page sections.
  const items=document.querySelectorAll(".card,.service-card,.image-card,.menu-item,.contact-panel,form");
  items.forEach((el,i)=>{
    el.style.opacity="0";
    el.style.transform="translateY(12px)";
    el.style.transition=`opacity .7s cubic-bezier(.22,1,.36,1) ${Math.min(i*.045,.28)}s, transform .7s cubic-bezier(.22,1,.36,1) ${Math.min(i*.045,.28)}s`;
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          el.style.opacity="1";el.style.transform="none";observer.unobserve(el);
        }
      });
    },{threshold:.08});
    observer.observe(el);
  });

  // Reservation confirmation — full-screen thank-you.
  const form=document.querySelector("#reserveForm");
  const success=document.querySelector("#bookingSuccess");
  const close=document.querySelector("#successClose");
  if(form && success){
    form.addEventListener("submit",e=>{
      e.preventDefault();
      const name=document.querySelector("#name")?.value.trim() || "Guest";
      const date=document.querySelector("#date")?.value || "";
      const guests=document.querySelector("#guests")?.value || "";
      const details=document.querySelector("#successDetails");
      if(details) details.textContent=[`Reserved for ${name}`,guests,date].filter(Boolean).join("  ·  ");
      success.classList.add("show");
      success.setAttribute("aria-hidden","false");
      document.body.classList.add("modal-open");
    });
  }
  const dismissBooking=()=>{
    success?.classList.remove("show");
    success?.setAttribute("aria-hidden","true");
    document.body.classList.remove("modal-open");
  };
  close?.addEventListener("click",dismissBooking);
  success?.addEventListener("click",e=>{if(e.target===success)dismissBooking()});

  // Soft link feedback; native navigation remains reliable for local files.
  document.querySelectorAll('a[href]').forEach(a=>{
    const href=a.getAttribute("href");
    if(!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || a.target==="_blank") return;
    a.addEventListener("click",()=>document.body.classList.add("leaving"));
  });
});

/* ÉLAN Drink Creator */
document.addEventListener("DOMContentLoaded",()=>{
  const buttons=[...document.querySelectorAll(".choice")];
  const cup=document.querySelector("#drinkCup");
  const topping=document.querySelector("#drinkTopping");
  const nameEl=document.querySelector("#drinkName");
  const priceEl=document.querySelector("#livePrice");
  const save=document.querySelector("#saveDrink");
  const result=document.querySelector("#creatorResult");
  if(!cup || !buttons.length)return;

  const state={};
  const update=()=>{
    let price=0,base="Espresso",milk="Whole Milk",flavour="Vanilla",finish="Cocoa Dust",color="#75452f",foam="#f1ddc5",top="✦";
    buttons.forEach(b=>{
      if(b.classList.contains("selected")){
        state[b.dataset.type]=b.dataset.name;
        price+=Number(b.dataset.price||0);
        if(b.dataset.type==="base"){base=b.dataset.name;color=b.dataset.color}
        if(b.dataset.type==="milk")foam=b.dataset.foam;
        if(b.dataset.type==="flavour")flavour=b.dataset.name;
        if(b.dataset.type==="finish"){finish=b.dataset.name;top=b.dataset.topping||""}
      }
    });
    cup.style.setProperty("--drink",color);
    cup.style.setProperty("--foam",foam);
    cup.style.setProperty("--base",base);
    topping.textContent=top;
    const shortFlavour=flavour==="None"?"":flavour+" ";
    nameEl.textContent=`${shortFlavour}${base}`;
    const detail=document.querySelector("#drinkDetail");
    if(detail) detail.textContent=`${base} · ${milk} · ${finish}`;
    priceEl.textContent=`₹${price}`;
    const previewPrice=document.querySelector("#previewPrice");
    if(previewPrice) previewPrice.textContent=`₹${price}`;

    // Make the preview behave like the selected drink.
    const ice=[...document.querySelectorAll(".ice")];
    const milkLayer=document.querySelector(".milk-layer");
    const syrup=document.querySelector(".syrup-swirl");
    const foamLayer=document.querySelector(".foam-layer");
    const liquidBack=document.querySelector(".liquid-back");

    const isCold=base==="Cold Brew";
    const isMatcha=base==="Matcha";
    ice.forEach((cube,i)=>{
      cube.style.opacity=isCold ? ".92" : "0";
      cube.style.transform=isCold
        ? `rotate(${[-12,16,8][i]}deg) translateY(${i*2}px)`
        : "scale(.7)";
    });
    if(liquidBack){
      liquidBack.style.opacity=isCold ? ".7" : ".2";
    }
    if(milkLayer){
      milkLayer.style.opacity=(milk==="Whole Milk" ? ".82" : ".68");
      milkLayer.style.background=isMatcha
        ? "linear-gradient(180deg,rgba(244,238,210,.92),rgba(177,190,132,.56))"
        : `linear-gradient(180deg,rgba(255,248,234,.86),${foam}88)`;
    }
    if(syrup) syrup.style.opacity=flavour==="None" ? ".08" : ".72";
    if(foamLayer){
      foamLayer.style.opacity=finish==="Whipped Cream" ? "1" : ".82";
      foamLayer.style.transform=finish==="Whipped Cream" ? "scale(1.08)" : "scale(1)";
    }
    return {base,milk,flavour,finish,price};
  };
  buttons.forEach(b=>b.addEventListener("click",()=>{
    document.querySelectorAll(`.choice[data-type="${b.dataset.type}"]`).forEach(x=>x.classList.remove("selected"));
    b.classList.add("selected");
    update();
  }));
  save?.addEventListener("click",()=>{
    const r=update();
    result.textContent=`Saved: ${r.flavour==="None"?"":r.flavour+" "}${r.base} · ${r.milk} · ${r.finish} — ₹${r.price}. Show this recipe to our barista.`;
    result.classList.add("show");
  });
  update();
});


/* Home hero video fallback + subtle cinematic motion */
document.addEventListener("DOMContentLoaded",()=>{
  const video=document.querySelector(".hero-video-media");
  if(!video) return;
  video.addEventListener("error",()=>{
    const hero=video.closest(".hero-video");
    if(hero) hero.classList.add("video-fallback");
  });
});


/* =========================================================
   ÉLAN ORDER BAG + CHECKOUT + DEMO PAYMENT
   ========================================================= */
document.addEventListener("DOMContentLoaded",()=>{
  const addButtons=[...document.querySelectorAll(".add-item")];
  const drawer=document.querySelector("#cartDrawer");
  const backdrop=document.querySelector("#cartBackdrop");
  const closeCart=document.querySelector("#cartClose");
  const bag=document.querySelector("#floatingBag");
  const itemsEl=document.querySelector("#cartItems");
  const countEl=document.querySelector("#cartCount");
  const totalEl=document.querySelector("#cartTotal");
  const checkout=document.querySelector("#checkoutModal");
  const checkoutOpen=document.querySelector("#checkoutOpen");
  const checkoutClose=document.querySelector("#checkoutClose");
  const summary=document.querySelector("#checkoutSummary");
  const checkoutTotal=document.querySelector("#checkoutTotal");
  const payment=document.querySelector("#paymentForm");
  const orderSuccess=document.querySelector("#orderSuccess");
  const orderNumber=document.querySelector("#orderNumber");
  const orderDone=document.querySelector("#orderDone");
  if(!bag || !drawer) return;

  let cart=JSON.parse(localStorage.getItem("elanCart")||"[]");

  const money=n=>`₹${n.toLocaleString("en-IN")}`;

  function save(){localStorage.setItem("elanCart",JSON.stringify(cart));}
  function render(){
    if(!cart.length){
      itemsEl.innerHTML='<div class="empty-cart">Your bag is waiting.<br>Add something delicious.</div>';
    }else{
      itemsEl.innerHTML=cart.map((x,i)=>`
        <div class="cart-line">
          <div><strong>${x.name}</strong><small>₹${x.price} each</small></div>
          <div class="qty"><button data-action="minus" data-i="${i}">−</button><b>${x.qty}</b><button data-action="plus" data-i="${i}">+</button></div>
          <strong>${money(x.price*x.qty)}</strong>
        </div>`).join("");
    }
    const count=cart.reduce((a,x)=>a+x.qty,0);
    const total=cart.reduce((a,x)=>a+x.price*x.qty,0);
    countEl.textContent=count;
    countEl.style.display=count?"inline-grid":"none";
    totalEl.textContent=money(total);
    checkoutTotal.textContent=money(total);
    summary.innerHTML=cart.length ? cart.map(x=>`<div><span>${x.name} × ${x.qty}</span><b>${money(x.price*x.qty)}</b></div>`).join("") : "<p>Your bag is empty.</p>";
  }
  function openCart(){drawer.classList.add("open");backdrop.classList.add("show");drawer.setAttribute("aria-hidden","false")}
  function hideCart(){drawer.classList.remove("open");backdrop.classList.remove("show");drawer.setAttribute("aria-hidden","true")}
  addButtons.forEach(btn=>btn.addEventListener("click",()=>{
    const name=btn.dataset.name, price=Number(btn.dataset.price);
    const found=cart.find(x=>x.name===name);
    if(found) found.qty++; else cart.push({name,price,qty:1});
    save();render();openCart();
    btn.classList.add('added');
    const old=btn.textContent; btn.textContent='✓ Added';
    setTimeout(()=>{btn.textContent=old;btn.classList.remove('added')},900);
  }));
  itemsEl.addEventListener("click",e=>{
    const b=e.target.closest("button[data-i]"); if(!b)return;
    const i=Number(b.dataset.i);
    if(b.dataset.action==="plus")cart[i].qty++;
    else {cart[i].qty--;if(cart[i].qty<=0)cart.splice(i,1)}
    save();render();
  });
  bag.addEventListener("click",openCart);closeCart?.addEventListener("click",hideCart);backdrop?.addEventListener("click",hideCart);

  checkoutOpen?.addEventListener("click",()=>{
    if(!cart.length){openCart();return}
    checkout.classList.add("show");checkout.setAttribute("aria-hidden","false");hideCart();
  });
  checkoutClose?.addEventListener("click",()=>{checkout.classList.remove("show");checkout.setAttribute("aria-hidden","true")});

  document.querySelectorAll(".pay-method").forEach(btn=>{
    btn.addEventListener("click",()=>{
      document.querySelectorAll(".pay-method").forEach(x=>x.classList.remove("active"));
      btn.classList.add("active");
      const m=btn.dataset.method;
      document.querySelector("#cardFields").style.display=m==="Card"?"block":"none";
      document.querySelector("#upiFields").style.display=m==="UPI"?"block":"none";
      document.querySelector("#cashFields").style.display=m==="Cash"?"block":"none";
      document.querySelectorAll("#cardFields input,#upiFields input").forEach(i=>i.required=m==="Card" && i.closest("#cardFields") ? true : false);
    });
  });

  payment?.addEventListener("submit",e=>{
    e.preventDefault();
    const active=document.querySelector(".pay-method.active")?.dataset.method||"Card";
    if(active==="UPI"){
      const input=document.querySelector("#upiFields input");
      if(!input.value.trim()){input.focus();return}
    }
    checkout.classList.remove("show");checkout.setAttribute("aria-hidden","true");
    orderNumber.textContent="ÉLAN ORDER · #"+Math.floor(10000+Math.random()*90000);
    orderSuccess.classList.add("show");orderSuccess.setAttribute("aria-hidden","false");
    cart=[];save();render();
  });
  orderDone?.addEventListener("click",()=>{orderSuccess.classList.remove("show");orderSuccess.setAttribute("aria-hidden","true");window.location.hash="menu"});
  render();
});

/* External-image fallback for café gallery background cards */
document.addEventListener("DOMContentLoaded",()=>{
  document.querySelectorAll(".image-card").forEach(card=>{
    const bg=getComputedStyle(card).backgroundImage;
    const match=bg.match(/url\(["']?([^"')]+)["']?\)/);
    if(!match)return;
    const probe=new Image();
    probe.onerror=()=>card.style.backgroundImage="url('https://www.macc-cino.com/assets/bakery/cup_pastry.png')";
    probe.src=match[1];
  });
});
