import{c as s,F as m}from"./hoisted.BfGRKvvF.js";function h(a,i=3e3){let l;return function(...n){l&&clearTimeout(l),l=setTimeout(()=>a(...n),i)}}function f(a,i,l={leading:!0,trailing:!0}){let n=0,r=null,d=null;const{leading:u=!0,trailing:o=!0}=l;return function(...c){const e=Date.now();!n&&!u&&(n=e);const t=i-(e-n);t<=0?(r&&(clearTimeout(r),r=null),n=e,a(...c)):o&&(r&&clearTimeout(r),r=setTimeout(()=>{n=u?Date.now():0,r=null,o&&d&&(a(...d),d=null)},t)),d=c}}async function g(a){return await new Promise(i=>{setTimeout(()=>{i()},a)})}const y=a=>{const i=document.querySelector(a);if(!i)return;let l=[];const n=f(()=>{let o=l.length-1;for(o;o>=0&&!(l[o].getBoundingClientRect().top<=80);o-=1);const c=l[o];Array.from(i.querySelector(".outlines")?.children??[]).forEach(e=>{e.getAttribute("data-anchor-id")===c?.id?e.classList.add("!opacity-100"):e.classList.remove("!opacity-100")})},200);document.addEventListener("scroll",n,{passive:!0});const d=(()=>{const o=()=>{const t=e.querySelector(".outlines");t&&(t?.style.display==="none"?(t.style.removeProperty("display"),e.classList.remove("md:w-[32px]")):(t.style.display="none",e.classList.add("md:w-[32px]")))},c=s("div",{class:"outlines flex flex-col text-sm gap-1 py-2 max-h-[60vh] overflow-y-auto <md:hidden break-words"}),e=s("div",{class:"fixed top-[84px] right-[4px] bg-modal p-2 rounded shadow-lg md:shadow-none md:sticky md:top-[88px] <md:[&:focus-within_.outlines]:flex flex flex-col <md:w-auto w-[240px]"},s("div",{class:"flex <md:justify-end",tabIndex:-1},s("button",{onClick:o,title:"toggle outline",class:"<md:hidden"},s("div",{class:"i-ri:menu-fold-4-fill"})),s("button",{title:"toggle outline",class:"md:hidden"},s("div",{class:"i-ri:menu-fold-4-fill"}))),c);return i.replaceChildren(e),c})(),u=()=>{const o=document.querySelector(".ud-root");if(!o)return;const e=["h1","h2","h3","h4","h5","h6"].map(t=>`${t}`).join(", ");l=Array.from(o?.querySelectorAll(e)??[]),d?.replaceChildren(s(m,null,l.map(t=>s("a",{tabIndex:-1,href:`#${t.id}`,"data-anchor-id":t.id,"data-anchor-tag":t.tagName,class:"opacity-50 hover:opacity-80 min-w-[180px]"},t.textContent))))};return u(),n(),u};export{h as d,y as m,g as s,f as t};
