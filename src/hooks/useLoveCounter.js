import {useEffect,useState} from "react";
export default function useLoveCounter(start,{live=false}={}){
  const [now,setNow]=useState(()=>Date.now());
  useEffect(()=>{
    if(!live)return;
    const t=setInterval(()=>setNow(Date.now()),1000);
    return()=>clearInterval(t);
  },[live]);
  const s=Math.max(0,Math.floor((now-new Date(start+"T00:00:00").getTime())/1000));
  const pad=n=>String(n).padStart(2,"0");
  return{
    days:Math.floor(s/86400),
    h:pad(Math.floor(s%86400/3600)),
    m:pad(Math.floor(s%3600/60)),
    s:pad(s%60),
    total:s
  };
}
