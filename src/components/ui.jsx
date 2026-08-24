import {useEffect,useRef,useState} from "react";
import {toThumb} from "../api/loveApi.js";

export function Ph({src,cap,onClick}){
  const ref=useRef(null),[cur,setCur]=useState(()=>toThumb(src));
  useEffect(()=>{setCur(toThumb(src))},[src]);
  useEffect(()=>{const el=ref.current;if(el&&el.complete&&el.naturalWidth>0)el.closest(".phWrap").classList.add("ok")},[cur]);
  return <span className="phWrap" data-cap={cap||""} onClick={onClick}><img ref={ref} src={cur} alt="" loading="lazy" decoding="async" onError={()=>{if(cur!==src)setCur(src)}} onLoad={e=>e.currentTarget.closest(".phWrap").classList.add("ok")}/></span>;
}

export function Chars({text,start=.25,step=.05}){
  return <>{[...(text||"")].map((c,i)=><span key={i} className="ch" style={{transitionDelay:`${start+i*step}s`}}>{c===" "?"\u00A0":c}</span>)}</>;
}

export function Reel({children}){
  const ref=useRef(null);
  useEffect(()=>{
    const el=ref.current;if(!el)return;
    if(window.matchMedia&&window.matchMedia("(hover: none)").matches)return;
    let dir=1,touchAt=0,id;
    const ts=()=>{touchAt=Date.now()};
    el.addEventListener("touchstart",ts,{passive:true});
    const tick=()=>{
      if(el.scrollWidth>el.clientWidth+4&&!el.matches(":hover")&&Date.now()-touchAt>1200){
        el.scrollLeft+=dir*.55;
        if(el.scrollLeft+el.clientWidth>=el.scrollWidth-2)dir=-1;
        else if(el.scrollLeft<=1)dir=1;
      }
      id=requestAnimationFrame(tick);
    };
    id=requestAnimationFrame(tick);
    return()=>{cancelAnimationFrame(id);el.removeEventListener("touchstart",ts)};
  },[]);
  return <div ref={ref} className="thumbStrip">{children}</div>;
}

export function CapCarousel({list,onOpen}){
  const [idx,setIdx]=useState(0),[pause,setPause]=useState(false);
  const len=list.length;
  useEffect(()=>{if(pause||len<2)return;const t=setInterval(()=>setIdx(i=>(i+1)%len),3600);return()=>clearInterval(t)},[pause,len]);
  useEffect(()=>{setIdx(0)},[len]);
  const go=d=>setIdx(i=>(i+d+len)%len);
  return <div className="capCaro" onMouseEnter={()=>setPause(true)} onMouseLeave={()=>setPause(false)}>
    {list.map((p,i)=><div key={p.id} className={"caroSlide"+(i===idx?" show":"")}>
      <img className="caroBg" src={toThumb(p.public_path)} alt="" aria-hidden="true"/>
      <img className="caroMain" src={toThumb(p.public_path)} decoding="async" onError={e=>{e.target.onerror=null;e.target.src=p.public_path}} alt={p.title||""} onClick={()=>onOpen(idx)}/>
      <div className="capCaption"><b>{p.title||"我们的瞬间"}</b>{p.location?` · ${p.location}`:""}{p.event_date?` · ${p.event_date.replaceAll("-",".")}`:""}</div>
    </div>)}
    <button className="caroNav prev" onClick={e=>{e.stopPropagation();go(-1)}}>‹</button>
    <button className="caroNav next" onClick={e=>{e.stopPropagation();go(1)}}>›</button>
    {len>1&&<>
      <div className="capDots">{list.map((p,i)=><i key={p.id} className={i===idx?"on":""} onClick={e=>{e.stopPropagation();setIdx(i)}}/>)}</div>
      <span className="caroNum">{idx+1}/{len}</span>
    </>}
  </div>;
}
