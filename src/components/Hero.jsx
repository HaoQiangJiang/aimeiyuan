import {useEffect,useMemo,useRef,useState} from "react";
import {motion} from "framer-motion";
import useLoveCounter from "../hooks/useLoveCounter.js";

function Stars(){
  const ref=useRef(null);
  const stars=useMemo(()=>Array.from({length:90},()=>({
    x:Math.random()*100,y:Math.random()*100,s:.7+Math.random()*1.7,
    d:Math.random()*6,dur:2.6+Math.random()*4,layer:"L"+Math.floor(Math.random()*3)
  })),[]);
  useEffect(()=>{
    if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
    const el=ref.current;if(!el)return;
    const mv=e=>{
      el.style.setProperty("--mx",(e.clientX/innerWidth-.5).toFixed(3));
      el.style.setProperty("--my",(e.clientY/innerHeight-.5).toFixed(3));
    };
    window.addEventListener("mousemove",mv,{passive:true});
    return()=>window.removeEventListener("mousemove",mv);
  },[]);
  return <div className="stars" ref={ref} aria-hidden="true">
    {stars.map((st,i)=><i key={i} className={st.layer} style={{left:st.x+"%",top:st.y+"%",width:st.s+"px",height:st.s+"px",animationDelay:`-${st.d}s`,animationDuration:`${st.dur}s`}}/>)}
  </div>;
}

export default function Hero({couple,start,heroBg}){
  const {days}=useLoveCounter(start);
  const [disp,setDisp]=useState(0);
  useEffect(()=>{
    let raf,st;
    const D=1300;
    const step=t=>{if(!st)st=t;const k=Math.min(1,(t-st)/D);
      setDisp(Math.round(days*(1-Math.pow(1-k,3))));
      if(k<1)raf=requestAnimationFrame(step)};
    raf=requestAnimationFrame(step);
    return()=>cancelAnimationFrame(raf);
  },[days]);
  const fade=(delay)=>({
    initial:{opacity:0,filter:"blur(10px)"},
    animate:{opacity:1,filter:"blur(0px)"},
    transition:{duration:.9,delay,ease:[.25,.7,.25,1]}
  });
  return <section className="hero dark">
    <div className="heroPhotoBg" style={{backgroundImage:`url("${heroBg}")`}}/>
    <Stars/>
    <div className="heroVeil"/>
    <div className="heroCore">
      <motion.div {...fade(.15)} className="heroHeart">♥</motion.div>
      <motion.p {...fade(.35)} className="eyebrow">{couple}</motion.p>
      <motion.p {...fade(.55)} className="heroDate">{start.replaceAll("-",".")}</motion.p>
      <motion.div {...fade(.75)} className="bigDays"><b>{disp.toLocaleString()}</b><span>DAYS</span></motion.div>
      <motion.p {...fade(1)} className="heroQuote">“我们的故事，还在继续。”</motion.p>
      <motion.a {...fade(1.25)} className="scrollCue" href="#timeline"><i>↓</i><span>开始我们的故事</span></motion.a>
    </div>
  </section>;
}
