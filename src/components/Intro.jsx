import {useEffect,useMemo,useState} from "react";

export default function Intro({done}){
 const [p,setP]=useState(0);
 const stars=useMemo(()=>{
  const arr=[];
  [[30,44,.25,3],[47,35,.75,2.6],[58,52,1.05,2.8]].forEach(([x,y,d,s])=>arr.push({x,y,d,s,big:true}));
  for(let i=0;i<64;i++){
   const x=12+(i/63)*74+(((i*37)%11)-5);
   const y=56-((x-12)*(30/76))+(((i*29)%13)-6);
   arr.push({x,y,d:1.35+Math.random()*1.25,s:.7+Math.random()*1.5});
  }
  return arr;
 },[]);
 useEffect(()=>{
  const ts=[setTimeout(()=>setP(1),2350),setTimeout(()=>setP(2),3500),setTimeout(()=>setP(3),4450),setTimeout(()=>setP(4),5150)];
  const end=setTimeout(done,5950);
  const sk=()=>done();
  window.addEventListener("keydown",sk);
  return()=>{ts.forEach(clearTimeout);clearTimeout(end);window.removeEventListener("keydown",sk)};
 },[]);
 return <div className={"intro"+(p>=4?" bye":"")} onClick={done}>
  {stars.map((s,i)=><i key={i} className={"iStar"+(s.big?" big":"")} style={{left:s.x+"%",top:s.y+"%",width:s.s+"px",height:s.s+"px",animationDelay:`${s.d}s`}}/>)}
  <p className={"iLine l1"+(p===1?" on":"")}>有些故事，不需要从头开始讲。</p>
  <p className={"iLine l2"+(p>=2&&p<3?" on":"")}>因为它本来就还在继续。</p>
  <div className={"iBrandBox"+(p>=3?" on":"")}>
   <div className="ibT">Our ♥ Universe</div>
   <small>我们爱的小宇宙</small>
  </div>
  <button className="iSkip" onClick={e=>{e.stopPropagation();done()}}>跳过 ›</button>
 </div>}

