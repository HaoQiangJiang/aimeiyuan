import {useEffect} from "react";
export default function useScrollReveal(deps){
  useEffect(()=>{
    let io,io2;
    try{
      io=new IntersectionObserver(es=>es.forEach(x=>{
        if(x.isIntersecting){x.target.classList.add("revealed");io.unobserve(x.target)}
      }),{threshold:.1});
    }catch(e){return}
    document.querySelectorAll("[data-reveal]").forEach(el=>{el.classList.add("rp");io.observe(el)});
    const tl=document.getElementById("timeline");
    if(tl&&"IntersectionObserver" in window){
      const line=tl.querySelector(".film");
      try{
        io2=new IntersectionObserver(es=>es.forEach(x=>{
          if(x.isIntersecting){line&&line.classList.add("grown");io2.disconnect()}
        }),{threshold:.05});
        line&&line.classList.add("tlp");
        io2.observe(tl);
      }catch(e){line&&line.classList.remove("tlp")}
    }
    const fin=document.getElementById("finale");
    let io3;
    if(fin&&"IntersectionObserver" in window){
      try{
        io3=new IntersectionObserver(es=>es.forEach(x=>{
          if(x.isIntersecting){fin.classList.add("dark");window.dispatchEvent(new Event("finale-in"));io3.disconnect()}
        }),{threshold:.45});
        io3.observe(fin);
      }catch(e){}
    }
    return()=>{io.disconnect();io2&&io2.disconnect();io3&&io3.disconnect()};
  },deps);
}
