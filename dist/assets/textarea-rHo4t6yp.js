import{j as f,l as p,r as S,H as T}from"./index-DYgWIKOm.js";class b{constructor(t=0,r="Network Error"){this.status=t,this.text=r}}const N=()=>{if(!(typeof localStorage>"u"))return{get:e=>Promise.resolve(localStorage.getItem(e)),set:(e,t)=>Promise.resolve(localStorage.setItem(e,t)),remove:e=>Promise.resolve(localStorage.removeItem(e))}},n={origin:"https://api.emailjs.com",blockHeadless:!1,storageProvider:N()},h=e=>e?typeof e=="string"?{publicKey:e}:e.toString()==="[object Object]"?e:{}:{},B=(e,t="https://api.emailjs.com")=>{if(!e)return;const r=h(e);n.publicKey=r.publicKey,n.blockHeadless=r.blockHeadless,n.storageProvider=r.storageProvider,n.blockList=r.blockList,n.limitRate=r.limitRate,n.origin=r.origin||t},$=async(e,t,r={})=>{const o=await fetch(n.origin+e,{method:"POST",headers:r,body:t}),i=await o.text(),s=new b(o.status,i);if(o.ok)return s;throw s},k=(e,t,r)=>{if(!e||typeof e!="string")throw"The public key is required. Visit https://dashboard.emailjs.com/admin/account";if(!t||typeof t!="string")throw"The service ID is required. Visit https://dashboard.emailjs.com/admin";if(!r||typeof r!="string")throw"The template ID is required. Visit https://dashboard.emailjs.com/admin/templates"},I=e=>{if(e&&e.toString()!=="[object Object]")throw"The template params have to be the object. Visit https://www.emailjs.com/docs/sdk/send/"},P=e=>e.webdriver||!e.languages||e.languages.length===0,C=()=>new b(451,"Unavailable For Headless Browser"),V=(e,t)=>{if(!Array.isArray(e))throw"The BlockList list has to be an array";if(typeof t!="string")throw"The BlockList watchVariable has to be a string"},A=e=>!e.list?.length||!e.watchVariable,D=(e,t)=>e instanceof FormData?e.get(t):e[t],j=(e,t)=>{if(A(e))return!1;V(e.list,e.watchVariable);const r=D(t,e.watchVariable);return typeof r!="string"?!1:e.list.includes(r)},R=()=>new b(403,"Forbidden"),F=(e,t)=>{if(typeof e!="number"||e<0)throw"The LimitRate throttle has to be a positive number";if(t&&typeof t!="string")throw"The LimitRate ID has to be a non-empty string"},M=async(e,t,r)=>{const o=Number(await r.get(e)||0);return t-Date.now()+o},L=async(e,t,r)=>{if(!t.throttle||!r)return!1;F(t.throttle,t.id);const o=t.id||e;return await M(o,t.throttle,r)>0?!0:(await r.set(o,Date.now().toString()),!1)},E=()=>new b(429,"Too Many Requests"),K=async(e,t,r,o)=>{const i=h(o),s=i.publicKey||n.publicKey,l=i.blockHeadless||n.blockHeadless,c=i.storageProvider||n.storageProvider,d={...n.blockList,...i.blockList},m={...n.limitRate,...i.limitRate};return l&&P(navigator)?Promise.reject(C()):(k(s,e,t),I(r),r&&j(d,r)?Promise.reject(R()):await L(location.pathname,m,c)?Promise.reject(E()):$("/api/v1.0/email/send",JSON.stringify({lib_version:"4.4.1",user_id:s,service_id:e,template_id:t,template_params:r}),{"Content-type":"application/json"}))},z=e=>{if(!e||e.nodeName!=="FORM")throw"The 3rd parameter is expected to be the HTML form element or the style selector of the form"},O=e=>typeof e=="string"?document.querySelector(e):e,W=async(e,t,r,o)=>{const i=h(o),s=i.publicKey||n.publicKey,l=i.blockHeadless||n.blockHeadless,c=n.storageProvider||i.storageProvider,d={...n.blockList,...i.blockList},m={...n.limitRate,...i.limitRate};if(l&&P(navigator))return Promise.reject(C());const u=O(r);k(s,e,t),z(u);const a=new FormData(u);return j(d,a)?Promise.reject(R()):await L(location.pathname,m,c)?Promise.reject(E()):(a.append("lib_version","4.4.1"),a.append("service_id",e),a.append("template_id",t),a.append("user_id",s),$("/api/v1.0/email/send-form",a))},y={init:B,send:K,sendForm:W,EmailJSResponseStatus:b},w="service_0lqnb2j",x="HJF2n6CK_DGo8ImBf",_="template_wmz7wca",Z={sendRegistryConfirmation:async e=>{const t=e.language==="fr",r=t?"Mariage de Cynthia & Steve":"Cynthia & Steve's Wedding",o=t?`Bonjour ${e.to_name},`:`Hi ${e.to_name},`,i=t?"Nous avons bien reçu votre souhait de contribuer à notre liste de mariage ! Merci infiniment.":"We have received your pledge to contribute to our wedding registry. Thank you so much!",s=`
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; border: 1px solid #eee;">
          <p><strong>${t?"Article":"Item"}:</strong> ${e.item_name}</p>
          <p><strong>${t?"Montant":"Amount"}:</strong> CHF ${e.amount}</p>
      </div>
    `,l=t?"Instructions de Paiement":"Payment Instructions",c=t?`
          <strong>IBAN:</strong> CH54 0024 3243 5109 5140 Q (Monsieur Steve Benjamin)<br>
          <strong>BIC:</strong> UBSWCHZH80A <br>
          <strong>Twint:</strong> +41 78 635 03 07 <br>
          <strong>Revolut:</strong> <a href="https://revolut.me/steveben">revolut.me/steveben</a> <br>
          <strong>Ref Code:</strong> ${e.ref_code}
        `:`
          <strong>IBAN:</strong> CH54 0024 3243 5109 5140 Q (Monsieur Steve Benjamin)<br>
          <strong>BIC:</strong> UBSWCHZH80A <br>
          <strong>Twint:</strong> +41 78 635 03 07 <br>
          <strong>Revolut:</strong> <a href="https://revolut.me/steveben">revolut.me/steveben</a> <br>
          <strong>Ref Code:</strong> ${e.ref_code}
        `,m=`
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; text-align: center;">${r}</h2>
          <p>${o}</p>
          <p>${i}</p>
          ${s}
          <h3>${l}</h3>
          <div style="background-color: #fff0f0; padding: 15px; border: 1px solid #ffdcdc; border-radius: 5px;">
              ${c}
          </div>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="text-align: center; font-size: 0.9em; color: #888;">Cynthia & Steve <br> 27.06.2026</p>
      </div>
    `,u={to_email:e.to_email,to_name:e.to_name,subject:t?`Confirmation - ${r}`:`Confirmation - ${r}`,email_content:m};return console.log("[EmailService] Sending Registry Email:",u),y.send(w,_,u,x).then(a=>(console.log("[EmailService] SUCCESS!",a.status,a.text),a)).catch(a=>{throw console.error("[EmailService] FAILED...",a),a})},sendRSVPConfirmation:async e=>{const t=e.language==="fr",r=t?"Mariage de Cynthia & Steve":"Cynthia & Steve's Wedding",o=t?`Bonjour ${e.to_name},`:`Hi ${e.to_name},`,i=t?"Nous avons bien reçu votre confirmation. Voici un récapitulatif :":"We have received your confirmation. Here is a summary:";let s="";e.dinner_status&&e.dinner_status!=="N/A"&&(s=`<p><strong>${t?"Souper":"Dinner"}:</strong> ${e.dinner_status}</p>`);let l="";!(e.dietary_info.toLowerCase().includes("none")||e.dietary_info.toLowerCase().includes("aucune"))&&e.dietary_info.trim()!==""&&(l=`<p><strong>${t?"Régime":"Dietary"}:</strong> ${e.dietary_info}</p>`);const d=`
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; border: 1px solid #eee;">
          <p><strong>Status:</strong> ${e.attending_status}</p>
          <p><strong>${t?"Invités":"Guests"}:</strong> ${e.guests_count} | <strong>${t?"Enfants":"Children"}:</strong> ${e.children_count}</p>
          ${s}
          ${l}
      </div>
    `,m="Cynthia & Steve <br> 27.06.2026",u=t?"Vous avez fait une erreur ? Pas de souci ! Remplissez simplement le formulaire à nouveau sur le site avec la même adresse email.":"Did you make a mistake? No problem! Simply fill out the form on the website again with the same email.",a=`
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; text-align: center;">${r}</h2>
          <p>${o}</p>
          <p>${i}</p>
          ${d}
          ${e.apero_summary||""}
          <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="text-align: center; font-size: 0.9em; color: #888;">
            ${u}
            <br><br>
            ${m}
          </p>
      </div>
    `,v={to_email:e.to_email,to_name:e.to_name,subject:t?`Confirmation RSVP - ${r}`:`RSVP Confirmation - ${r}`,email_content:a};return console.log("[EmailService] Sending RSVP Email:",v),y.send(w,_,v,x).then(g=>(console.log("[EmailService] SUCCESS!",g.status,g.text),g)).catch(g=>{throw console.error("[EmailService] FAILED...",g),g})}};function Y({className:e,type:t,...r}){return f.jsx("input",{type:t,"data-slot":"input",className:p("file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm","focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]","aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",e),...r})}var q=["a","button","div","form","h2","h3","img","input","label","li","nav","ol","p","select","span","svg","ul"],U=q.reduce((e,t)=>{const r=T(`Primitive.${t}`),o=S.forwardRef((i,s)=>{const{asChild:l,...c}=i,d=l?r:t;return typeof window<"u"&&(window[Symbol.for("radix-ui")]=!0),f.jsx(d,{...c,ref:s})});return o.displayName=`Primitive.${t}`,{...e,[t]:o}},{}),J="Label",H=S.forwardRef((e,t)=>f.jsx(U.label,{...e,ref:t,onMouseDown:r=>{r.target.closest("button, input, select, textarea")||(e.onMouseDown?.(r),!r.defaultPrevented&&r.detail>1&&r.preventDefault())}}));H.displayName=J;var G=H;function X({className:e,...t}){return f.jsx(G,{"data-slot":"label",className:p("flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",e),...t})}function ee({className:e,...t}){return f.jsx("textarea",{"data-slot":"textarea",className:p("resize-none border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-input-background px-3 py-2 text-base transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",e),...t})}export{Z as E,Y as I,X as L,ee as T};
