import React,{useEffect,useMemo,useState,useRef} from "react";
import {createRoot} from "react-dom/client";
import "./styles.css";
import "./anniv.css";
import "./admin.css";
import "./album.css";
import "./polish.css";
import "./hero.css";
import "./intro.css";

const fmtDate=s=>s?.replaceAll("-"," / ")||"";
const guessEmoji=t=>{t=t||"";return /领证|结婚|婚礼|婚戒/.test(t)?"💍":/旅行|旅游|出行|度假|海边|爬山|自驾/.test(t)?"✈️":/见面|初见|相识|第一次见/.test(t)?"🌸":/约会|电影|吃饭|晚餐|午餐|咖啡|逛街|游乐园/.test(t)?"🎬":/生日/.test(t)?"🎂":/纪念|周年/.test(t)?"🎉":/搬家|新家|同居|回家|装修/.test(t)?"🏠":/毕业|录取|入职|升职|offer/i.test(t)?"🎓":/宠物|猫|狗|毛孩子/.test(t)?"🐾":"♥"};
const hasCapsule=x=>Boolean(x&&(x.song||x.moment_time||x.moment_note));

function Intro({done}){
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

function Chars({text,start=.25,step=.05}){return <>{[...(text||"")].map((c,i)=><span key={i} className="ch" style={{transitionDelay:`${start+i*step}s`}}>{c===" "?"\u00A0":c}</span>)}</>}

function Clock({start}){const [now,setNow]=useState(Date.now());useEffect(()=>{const t=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(t)},[]);
 const sec=Math.max(0,Math.floor((now-new Date(start+"T00:00:00").getTime())/1000)),p=n=>String(n).padStart(2,"0");
 return <div className="clockRow"><span>{p(Math.floor(sec%86400/3600))}</span><em>时</em><span>{p(Math.floor(sec%3600/60))}</span><em>分</em><span>{p(sec%60)}</span><em>秒</em></div>}

function Stars(){
 const ref=useRef(null);
 const stars=useMemo(()=>Array.from({length:110},()=>({x:Math.random()*100,y:Math.random()*100,s:.7+Math.random()*1.9,d:Math.random()*6,dur:2.4+Math.random()*4.2,layer:"L"+Math.floor(Math.random()*3)})),[]);
 useEffect(()=>{
  if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const el=ref.current;if(!el)return;
  const mv=e=>{el.style.setProperty("--mx",(e.clientX/innerWidth-.5).toFixed(3));el.style.setProperty("--my",(e.clientY/innerHeight-.5).toFixed(3))};
  window.addEventListener("mousemove",mv,{passive:true});
  return()=>window.removeEventListener("mousemove",mv);
 },[]);
 return <div className="stars" ref={ref} aria-hidden="true">
  {stars.map((st,i)=><i key={i} className={st.layer} style={{left:st.x+"%",top:st.y+"%",width:st.s+"px",height:st.s+"px",animationDelay:`-${st.d}s`,animationDuration:`${st.dur}s`}}/>)}
  <b className="shooting" style={{top:"14%",right:"16%"}}/>
  <b className="shooting s2"/>
 </div>}

function annivInfo(month,day){const now=new Date(),today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
 let target=new Date(now.getFullYear(),month-1,day);
 if(target.getTime()===today.getTime())return{today:true,pct:100,target};
 while(target<today)target=new Date(target.getFullYear()+1,month-1,day);
 const prev=new Date(target);prev.setFullYear(prev.getFullYear()-1);
 const pct=Math.min(100,Math.max(2,Math.round((today-prev)/(target-prev)*100)));
 return{today:false,days:Math.round((target-today)/864e5),pct,target}}

function Anniversary({emoji,name,month,day}){const info=useMemo(()=>annivInfo(month,day),[month,day]);
 return <article className={"glass anni"+(info.today?" today":"")}>
  <div className="anniTop"><span className="anniEmoji">{emoji}</span><span className="anniDate">每年 {month} 月 {day} 日</span></div>
  <h3>{name}</h3>
  {info.today?<p className="anniMsg">🎉 就是今天！纪念日快乐，永远爱你。</p>
   :<><div className="anniDays"><b>{info.days}</b><span>天后</span></div>
   <p className="muted">下一场 · {info.target.getFullYear()} 年 {month} 月 {day} 日</p>
   <div className="anniBar"><i style={{width:info.pct+"%"}}/></div>
   <small>本年度期待进度 {info.pct}%</small></>}
 </article>}

const toThumb=p=>p&&p.startsWith("/photos/")?"/photos-thumb/"+p.slice(8):p;

function Ph({src,alt,onClick}){const ref=useRef(null),[cur,setCur]=useState(()=>toThumb(src));
 useEffect(()=>{setCur(toThumb(src))},[src]);
 useEffect(()=>{const el=ref.current;if(el&&el.complete&&el.naturalWidth>0)el.closest(".phWrap").classList.add("ok")},[cur]);
 return <span className="phWrap" onClick={onClick}><img ref={ref} src={cur} alt={alt||""} loading="lazy" onError={()=>{if(cur!==src)setCur(src)}} onLoad={e=>e.currentTarget.closest(".phWrap").classList.add("ok")}/></span>}

function CapCarousel({list,onOpen}){
 const [idx,setIdx]=useState(0),[pause,setPause]=useState(false);
 useEffect(()=>{if(pause||list.length<2)return;const t=setInterval(()=>setIdx(i=>(i+1)%list.length),3400);return()=>clearInterval(t)},[pause,list.length]);
 useEffect(()=>{setIdx(0)},[list.length]);
 return <div className="capCaro" onMouseEnter={()=>setPause(true)} onMouseLeave={()=>setPause(false)}>
  {list.map((p,i)=><img key={p.id} className={"capPhoto caroImg"+(i===idx?" show":"")} src={toThumb(p.public_path)} onError={e=>{e.target.onerror=null;e.target.src=p.public_path}} alt={p.title||""} onClick={()=>onOpen(i)}/>)}
  {list.length>1&&<>
   <div className="capDots">{list.map((p,i)=><i key={p.id} className={i===idx?"on":""} onClick={e=>{e.stopPropagation();setIdx(i)}}/>)}</div>
   <span className="caroNum">{idx+1}/{list.length}</span>
  </>}
 </div>}

function Reel({children}){
 const ref=useRef(null);
 useEffect(()=>{
  const el=ref.current;if(!el)return;
  let dir=1,id;
  const tick=()=>{
   if(el.scrollWidth>el.clientWidth+4&&!el.matches(":hover")){
    el.scrollLeft+=dir*.55;
    if(el.scrollLeft+el.clientWidth>=el.scrollWidth-2)dir=-1;
    else if(el.scrollLeft<=1)dir=1;
   }
   id=requestAnimationFrame(tick);
  };
  id=requestAnimationFrame(tick);
  return()=>cancelAnimationFrame(id);
 },[]);
 return <div ref={ref} className="thumbStrip">{children}</div>}

const EMOJIS=["♥","✦","🌸","🎬","✈️","💍","🎂","🎉","🏠","🎓","🐾","⭐"];

class Boundary extends React.Component{
 constructor(p){super(p);this.state={bad:false}}
 static getDerivedStateFromError(){return{bad:true}}
 render(){if(!this.state.bad)return this.props.children;
  return <div style={{minHeight:"70vh",display:"grid",placeItems:"center",textAlign:"center"}}>
   <div><div style={{fontSize:46}}>♥</div><p style={{color:"#8a6b78"}}>出了点小状况，刷新一下就好</p>
   <button onClick={()=>location.reload()} style={{marginTop:12,padding:"10px 24px",borderRadius:999,border:0,background:"linear-gradient(135deg,#f48cad,#bd8de7)",color:"#fff",fontSize:14,cursor:"pointer"}}>刷新页面</button></div></div>}}

function App(){
 const [settings,setSettings]=useState({start_date:"2024-02-14",couple_name:"Our Little Universe"});
 const [events,setEvents]=useState([]),[photos,setPhotos]=useState([]),[stories,setStories]=useState([]),[places,setPlaces]=useState([]),[songs,setSongs]=useState([]),[wishes,setWishes]=useState([]);
 const [modal,setModal]=useState(null),[form,setForm]=useState({}),[file,setFile]=useState(null);
 const [lb,setLb]=useState(null),[showTop,setShowTop]=useState(false),[navShow,setNavShow]=useState(false);
 const [admin,setAdmin]=useState(false),[tokenInput,setTokenInput]=useState(localStorage.getItem("loveAdminToken")||"");
 const [busy,setBusy]=useState(false),[toast,setToast]=useState("");
 const TOKEN=useMemo(()=>localStorage.getItem("loveAdminToken")||"",[]);
 const notify=m=>{setToast(m);setTimeout(()=>setToast(""),3200)};

 const api=async(path,options={})=>{
  const r=await fetch(path,{...options,headers:{"content-type":"application/json",authorization:`Bearer ${TOKEN}`,...(options.headers||{})}});
  const d=await r.json().catch(()=>({}));
  if(!r.ok){
    if(r.status===401)throw new Error("管理密钥无效，请重新登录管理员");
    throw new Error(d.error||`请求失败(${r.status})`);
  }
  return d};

 const reload=async()=>{const rs=await Promise.allSettled([api("/api/settings"),api("/api/timeline"),api("/api/photos"),api("/api/stories"),api("/api/places"),api("/api/songs"),api("/api/wishes")]);
  if(rs[0].status==="fulfilled")setSettings(rs[0].value);
  if(rs[1].status==="fulfilled")setEvents(rs[1].value);
  if(rs[2].status==="fulfilled")setPhotos(rs[2].value);
  if(rs[3].status==="fulfilled")setStories(rs[3].value);
  if(rs[4].status==="fulfilled")setPlaces(rs[4].value);
  if(rs[5].status==="fulfilled")setSongs(rs[5].value);
  if(rs[6].status==="fulfilled")setWishes(rs[6].value);};
 useEffect(()=>{reload();
  if(TOKEN)fetch("/api/admin/check",{headers:{authorization:`Bearer ${TOKEN}`}}).then(r=>{
    if(r.ok)setAdmin(true);
    else{notify("保存的密钥已失效，请重新登录管理员");setModal({kind:"admin"})}
  }).catch(()=>{})},[]);

 const photosByEvent=useMemo(()=>{const m={};photos.forEach(p=>{const k=p.event_id||"";(m[k]=m[k]||[]).push(p)});return m},[photos]);
 useEffect(()=>{if(!lb)return;let sx=0;const h=e=>{if(e.key==="Escape")setLb(null);
  if(e.key==="ArrowRight")setLb(x=>({...x,index:(x.index+1)%x.list.length}));
  if(e.key==="ArrowLeft")setLb(x=>({...x,index:(x.index-1+x.list.length)%x.list.length}))};
  const ts=e=>{sx=e.touches[0].clientX},te=e=>{const dx=e.changedTouches[0].clientX-sx;
   if(Math.abs(dx)>55)setLb(x=>({...x,index:(x.index+(dx<0?1:-1)+x.list.length)%x.list.length}))};
  window.addEventListener("keydown",h);window.addEventListener("touchstart",ts,{passive:true});window.addEventListener("touchend",te);
  return()=>{window.removeEventListener("keydown",h);window.removeEventListener("touchstart",ts);window.removeEventListener("touchend",te)}},[lb]);
 useEffect(()=>{const f=()=>{setShowTop(window.scrollY>600);setNavShow(window.scrollY>window.innerHeight*.72)};window.addEventListener("scroll",f,{passive:true});f();return()=>window.removeEventListener("scroll",f)},[]);
 useEffect(()=>{
  let io,io2;
  try{
   io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add("revealed");io.unobserve(x.target)}}),{threshold:.1});
  }catch(e){return}
  document.querySelectorAll("[data-reveal]").forEach(el=>{el.classList.add("rp");io.observe(el)});
  const tl=document.getElementById("timeline");
  if(tl&&"IntersectionObserver" in window){
   const line=tl.querySelector(".film");
   try{
    io2=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){line&&line.classList.add("grown");io2.disconnect()}}),{threshold:.05});
    line&&line.classList.add("tlp");io2.observe(tl)
   }catch(e){line&&line.classList.remove("tlp")}
  }
  return()=>{io.disconnect();io2&&io2.disconnect()}},[events,photos,stories]);
 const openAlbum=eid=>{setFYear("");setFLoc("");setModal({kind:"album",data:eid})};
 const [fYear,setFYear]=useState(""),[fLoc,setFLoc]=useState("");
 const [playerOpen,setPlayerOpen]=useState(false),[cur,setCur]=useState(-1),[pPlaying,setPPlaying]=useState(false),[pPos,setPPos]=useState(0),[pDur,setPDur]=useState(0);
 const [letterOpen,setLetterOpen]=useState(false),[paperGo,setPaperGo]=useState(false);
 useEffect(()=>{if(letterOpen){const t=setTimeout(()=>setPaperGo(true),120);return()=>clearTimeout(t)}setPaperGo(false)},[letterOpen]);
 const [secOk,setSecOk]=useState(()=>{try{return sessionStorage.getItem("oluSec")==="1"}catch(e){return false}});
 const [secAns,setSecAns]=useState(""),[secErr,setSecErr]=useState("");
 const today=useMemo(()=>{const d=new Date();return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,"0")}.${String(d.getDate()).padStart(2,"0")}`},[]);
 const openSecret=()=>{if(secOk)return setModal({kind:"secretView"});setSecAns("");setSecErr("");setModal({kind:"secretAsk"})};
 const checkSecret=async()=>{try{setBusy(true);
  await api("/api/secret/check",{method:"POST",body:JSON.stringify({answer:secAns})});
  try{sessionStorage.setItem("oluSec","1")}catch(e){}
  setSecOk(true);setModal({kind:"secretView"});notify("密码正确 ♥")}
  catch(e){if(e.message==="not_set")alert("这颗胶囊还没有配置问题，请管理员先设置");
   else if(e.message==="unauthorized"||e.message==="wrong"){setSecErr("再想想看 ♥");setTimeout(()=>setSecErr(""),2600)}
   else alert(e.message)}
  finally{setBusy(false)}};
 const relock=()=>{try{sessionStorage.removeItem("oluSec")}catch(e){}setSecOk(false);setModal(null);notify("已重新上锁 🔒")};
 const openSecretEdit=async()=>{try{setBusy(true);
  const cfg=await api("/api/secret/config");
  setForm({sq:cfg.secret_q||"",sa:cfg.secret_a||"",sp:cfg.secret_photo||"",sn:cfg.secret_note||""});
  setModal({kind:"secretEdit"})}catch(e){alert(e.message)}finally{setBusy(false)}};
 const saveSecret=async()=>{try{setBusy(true);
  await api("/api/settings",{method:"PUT",body:JSON.stringify({secret_q:form.sq||"",secret_a:form.sa||"",secret_photo:form.sp||"",secret_note:form.sn||""})});
  notify("秘密已封存 ♥");setModal(null)}catch(e){alert(e.message)}finally{setBusy(false)}};
 const [fin,setFin]=useState(0);
 useEffect(()=>{const el=document.getElementById("finale");if(!el)return;
  let io;try{io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){
   el.classList.add("dark");
   setTimeout(()=>setFin(1),1000);setTimeout(()=>setFin(2),2800);setTimeout(()=>setFin(3),4400);setTimeout(()=>setFin(4),6000);
   io.disconnect()}}),{threshold:.55});io.observe(el)}catch(e){}
  return()=>io&&io.disconnect()},[]);
 const audioRef=useRef(null);
 const playSong=i=>{if(!songs.length)return;setCur(((i%songs.length)+songs.length)%songs.length);setPPlaying(true)};
 useEffect(()=>{const a=audioRef.current;if(!a)return;
  if(cur<0||!songs[cur]){a.pause();setPPlaying(false);return}
  const want=songs[cur].file_path;
  if(!a.src.endsWith(want))a.src=want;
  if(pPlaying)a.play().catch(()=>setPPlaying(false));else a.pause()},[cur,pPlaying,songs]);
 useEffect(()=>{const a=audioRef.current;if(!a)return;const t=setInterval(()=>{setPPos(a.currentTime||0);setPDur(a.duration||0)},500);return()=>clearInterval(t)},[]);
 const fmtT=s=>isFinite(s)?`${String(Math.floor(s/60)).padStart(2,"0")}:${String(Math.floor(s%60)).padStart(2,"0")}`:"00:00";
 const seek=e=>{const a=audioRef.current;if(!a||!a.duration)return;const r=e.currentTarget.getBoundingClientRect();a.currentTime=((e.clientX-r.left)/r.width)*a.duration;setPPos(a.currentTime)};
 const openPlaceForm=(pl={})=>{setForm(pl.id?{...pl}:{name:"",event_date:new Date().toISOString().slice(0,10),description:"",x:50,y:50});setModal({kind:"placeForm",data:pl})};
 const savePlace=async()=>{try{setBusy(true);const {id}=modal.data;
  if(!form.name)return alert("请填写地点名称");
  await api(id?`/api/places/${id}`:"/api/places",{method:id?"PUT":"POST",body:JSON.stringify({...form,x:+form.x,y:+form.y})});
  notify("坐标已标记 🗺");setModal(null);reload()}catch(e){alert(e.message)}finally{setBusy(false)}};
 const delPlace=async id=>{if(!confirm("移除这个地点标记？"))return;try{await api(`/api/places/${id}`,{method:"DELETE"});notify("已移除");reload()}catch(e){alert(e.message)}};
 const uploadSong=async()=>{try{
  if(!file)return alert("请先选择音频文件");
  setBusy(true);
  const b64=await new Promise((ok,err)=>{const r=new FileReader();r.onload=()=>ok(r.result.split(",")[1]);r.onerror=err;r.readAsDataURL(file)});
  await api("/api/songs/upload",{method:"POST",body:JSON.stringify({filename:file.name,content:b64,name:form.name||"",event_id:form.event_id||null})});
  notify("歌曲已入库 ♫");setFile(null);setModal(null);reload()}catch(e){alert(e.message)}finally{setBusy(false)}};
 const delSong=async s=>{if(!confirm(`从歌单移除《${s.name}》？`))return;try{await api(`/api/songs/${s.id}`,{method:"DELETE"});notify("已移除");reload()}catch(e){alert(e.message)}};
 const saveLetter=async()=>{try{setBusy(true);
  await api("/api/settings",{method:"PUT",body:JSON.stringify({letter_greeting:form.lg||"",letter_body:form.lb||"",letter_signoff:form.ls||""})});
  notify("信已重新封好 ♥");setModal(null);reload()}catch(e){alert(e.message)}finally{setBusy(false)}};
 const addWish=async()=>{try{if(!form.wtext)return alert("写下愿望内容");
  setBusy(true);await api("/api/wishes",{method:"POST",body:JSON.stringify({text:form.wtext})});notify("愿望已加入清单 ✨");setForm({...form,wtext:""});setModal(null);reload()}catch(e){alert(e.message)}finally{setBusy(false)}};
 const toggleWish=async w=>{if(!admin)return;try{setWishes(ws=>ws.map(x=>x.id===w.id?{...x,done:x.done?0:1}:x));
  await api(`/api/wishes/${w.id}`,{method:"PUT",body:JSON.stringify({text:w.text,done:w.done?0:1})})}catch(e){alert(e.message);reload()}};
 const delWish=async id=>{if(!confirm("删除这条愿望？"))return;try{await api(`/api/wishes/${id}`,{method:"DELETE"});reload()}catch(e){alert(e.message)}};
 const daysTogether=useMemo(()=>Math.max(0,Math.floor((Date.now()-new Date(settings.start_date+"T00:00:00").getTime())/864e5)),[settings.start_date]);
 const [intro,setIntro]=useState(()=>{
  try{if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)return false;
   return !sessionStorage.getItem("oluIntroDone")}catch(e){return false}});
 const endIntro=()=>{try{sessionStorage.setItem("oluIntroDone","1")}catch(e){}setIntro(false)};
 useEffect(()=>{document.body.style.overflow=intro?"hidden":"";return()=>{document.body.style.overflow=""}},[intro]);

 /* ---------- 时间轴 ---------- */
 const openEvent=(ev={})=>{setForm(ev.id?{...ev}:{event_date:new Date().toISOString().slice(0,10),emoji:"",title:"",description:"",song:"",moment_time:"",moment_note:""});setModal({kind:"event",data:ev})};
 const openCapsule=eid=>setModal({kind:"capsule",data:eid});
 const applyEventLocal=(id,patch)=>setEvents(es=>{const has=es.some(x=>x.id===id);return has?es.map(x=>x.id===id?{...x,...patch,id}:x):[...es,{...patch,id}]});
 const saveEvent=async()=>{try{setBusy(true);const {id}=modal.data;
  if(!form.event_date||!form.title)return alert("日期和标题不能为空");
  const saved={event_date:form.event_date,title:form.title,description:form.description||"",emoji:form.emoji||"",song:form.song||"",moment_time:form.moment_time||"",moment_note:form.moment_note||""};
  const r=await api(id?`/api/timeline/${id}`:"/api/timeline",{method:id?"PUT":"POST",body:JSON.stringify(saved)});
  applyEventLocal(id||r.id,saved);
  notify(id?"回忆已更新 ♥":"新回忆已添加 ♥");setModal(null);reload()}catch(e){alert((e.message||"网络异常")+"（若刚才显示已保存，内容不会丢失，刷新即可看到）")}finally{setBusy(false)}};
 const delEvent=async id=>{if(!confirm("确定删除这条回忆吗？"))return;try{await api(`/api/timeline/${id}`,{method:"DELETE"});notify("已删除");reload()}catch(e){alert(e.message)}};

 /* ---------- 故事 ---------- */
 const openStory=(st={})=>{setForm(st.id?{...st}:{title:"",body:""});setModal({kind:"story",data:st})};
 const saveStory=async()=>{try{setBusy(true);const {id}=modal.data;
  if(!form.title||!form.body)return alert("标题和内容不能为空");
  await api(id?`/api/stories/${id}`:"/api/stories",{method:id?"PUT":"POST",body:JSON.stringify(form)});
  notify(id?"故事已更新 ♥":"新故事已发布 ♥");setModal(null);reload()}catch(e){alert(e.message)}finally{setBusy(false)}};
 const delStory=async id=>{if(!confirm("确定删除这个故事吗？"))return;try{await api(`/api/stories/${id}`,{method:"DELETE"});notify("已删除");reload()}catch(e){alert(e.message)}};

 /* ---------- 照片 ---------- */
 const openUpload=(eid="")=>{setFile(null);setForm({title:"",caption:"",event_date:new Date().toISOString().slice(0,10),event_id:eid,location:""});setModal({kind:"upload"})};
 const uploadPhoto=async()=>{try{
  if(!file)return alert("请先选择图片");
  setBusy(true);
  const b64=await new Promise((ok,err)=>{const r=new FileReader();r.onload=()=>ok(r.result.split(",")[1]);r.onerror=err;r.readAsDataURL(file)});
  await api("/api/photos/upload",{method:"POST",body:JSON.stringify({filename:file.name,content:b64,...form})});
  notify("照片已提交，正在自动部署（约 1 分钟后显示）");setModal(null);reload()}catch(e){alert(e.message)}finally{setBusy(false)}};
 const openPhotoMeta=p=>{setForm({title:p.title||"",caption:p.caption||"",event_date:p.event_date||"",event_id:p.event_id||"",location:p.location||""});setModal({kind:"photoMeta",data:p})};
 const savePhotoMeta=async()=>{try{setBusy(true);
  await api(`/api/photos/${modal.data.id}`,{method:"PUT",body:JSON.stringify(form)});
  notify("照片信息已更新 ♥");setModal(null);reload()}catch(e){alert(e.message)}finally{setBusy(false)}};
 const delPhoto=async p=>{if(!confirm(`确定删除照片「${p.title||p.public_path}」？将同时从 GitHub 仓库移除。`))return;
  try{setBusy(true);const d=await api(`/api/photos/${p.id}`,{method:"DELETE"});
  notify(d.repo_file_removed?"已删除，仓库将在部署后同步":"记录已删除，但仓库文件删除失败，建议稍后在 GitHub 检查");
  setLb(null);setModal(null);reload()}catch(e){alert(e.message)}finally{setBusy(false)}};

 /* ---------- 登录 ---------- */
 const login=async()=>{const k=tokenInput.trim();if(!k)return alert("请输入管理密钥");
  try{setBusy(true);
   const r=await fetch("/api/admin/check",{headers:{authorization:`Bearer ${k}`}});
   if(!r.ok)return alert("密钥不正确，请重新输入");
   localStorage.setItem("loveAdminToken",k);location.reload()}catch(e){alert("网络异常，请稍后再试")}finally{setBusy(false)}};
 const logout=()=>{localStorage.removeItem("loveAdminToken");location.reload()};

 const displayEvents=events.length?events:[{event_date:"2024-02-14",title:"第一次见面",description:"故事从这里开始。",emoji:"✦"},{event_date:"2024-03-09",title:"第一次约会",description:"一顿普通的饭，后来成了很重要的记忆。",emoji:"♥"},{event_date:"2024-06-18",title:"第一次旅行",description:"把陌生城市走成了我们的地图。",emoji:"✈"}];

 return <div>
  {intro&&<Intro done={endIntro}/>}
  <nav className={"nav"+(navShow?" show":"")}><a className="brand" href="#">Our <span>♥</span> Universe<em>我们爱的小宇宙</em></a><div className="links"><a href="#anniversary">纪念日</a><a href="#timeline">人生胶片</a><a href="#places">去过的地方</a><a href="#stories">故事</a></div><button className="round" onClick={()=>setModal({kind:"admin"})}>{admin?"🔓":"⚙"}</button></nav>
  <main>
   <section className="hero dark">
    <div className="heroPhotoBg" style={{backgroundImage:`url("${settings.hero_bg||"/photos/我们领证了/marriage-01.jpg"}")`}}/>
    <Stars/>
    <div className="heroVeil"/>
    <div className="heroCore">
     <div className="heroHeart">♥</div>
     <p className="eyebrow">✦ 我们已经在一起了 ✦</p>
     <div className="bigDays"><b>{daysTogether}</b><span>天</span></div>
     <Clock start={settings.start_date}/>
     <p className="forever">{fmtDate(settings.start_date)} → <b>永远</b></p>
     <a className="scrollCue" href="#timeline"><i>↓</i><span>点击，开始我们的故事</span></a>
    </div>
   </section>
   <section id="anniversary"><div className="wrap"><div className="head"><div><small>NEXT CELEBRATIONS</small><h2>值得期待的日子</h2></div><p>每一个纪念日，都值得提前开始高兴。</p></div><div className="anniGrid"><Anniversary emoji="💍" name="领证纪念日" month={9} day={1}/><Anniversary emoji="🥂" name="结婚纪念日" month={10} day={1}/></div></div></section>
   <section id="timeline"><div className="wrap"><div className="head"><div><small>LIFE FILM</small><h2>人生胶片</h2></div><p>时间是一条慢慢显影的胶片，每一格都值得停久一点。</p></div>
    <div className="film">{(()=>{let lastYear="";
     return displayEvents.map((x,i)=>{const k=x.id||"i"+i;const g=photosByEvent[x.id]||[];const ico=(x.emoji&&x.emoji!=="♥")?x.emoji:guessEmoji(x.title);
      const yr=(x.event_date||"").slice(0,4);const showYear=yr&&yr!==lastYear;if(yr)lastYear=yr;
      return <React.Fragment key={k}>
       {showYear&&<div className="filmYear" data-reveal><span className="yearMark">{yr}</span></div>}
       <article data-reveal className="filmNode clickable" onClick={()=>x.id&&openCapsule(x.id)}>
        <i className="nodeDot">{ico}</i>
        <div className="nodeBody">
         {g.length>0&&<Reel>{g.slice(0,9).map((p,j)=><Ph key={p.id} src={p.public_path} onClick={e=>{e.stopPropagation();setLb({list:g,index:j})}}/>)}{g.length>9&&<span className="thumbMore">+{g.length-9}</span>}</Reel>}
         <h3 className="nTitle"><Chars text={x.title}/>{g.length>0&&<em className="photoCount inline">📷 {g.length}</em>}</h3>
         <span className="nDate">{(x.event_date||"").replaceAll("-",".")}</span>
         <p className="nDesc">{x.description||"这一页还没有写字。"}</p>
         {(hasCapsule(x))&&<p className="nSongHint">🎵 这颗胶囊里藏着一首歌</p>}
         <div className="evActions">
          {g.length>0&&<button className="mini primary" onClick={e=>{e.stopPropagation();openAlbum(x.id)}}>打开相册（{g.length} 张）</button>}
          {!g.length&&!admin&&<em className="photoCount ghost">照片整理中 ♥</em>}
          {admin&&x.id&&<><button className="mini" onClick={e=>{e.stopPropagation();openUpload(x.id)}}>＋ 传照片</button><button className="mini" onClick={e=>{e.stopPropagation();openEvent(x)}}>编辑</button><button className="mini danger" onClick={e=>{e.stopPropagation();delEvent(x.id)}}>删除</button></>}
         </div>
        </div>
       </article>
      </React.Fragment>})})()}
    </div>
    {admin&&<button className="primary add" onClick={()=>openEvent()}>＋ 添加回忆</button>}</div></section>
   <section id="places"><div className="wrap"><div className="head"><div><small>OUR PLACES</small><h2>我们去过的地方</h2></div><p>每颗爱心，都是现实世界里属于我们的坐标。</p></div>
    <div className="mapCard glass">
     {places.length>0?<>
      <svg className="mapSvg" viewBox="0 0 100 100" preserveAspectRatio="none">
       <path d={(()=>{const pts=[...places].sort((a,b)=>(a.event_date||"").localeCompare(b.event_date||""));if(!pts.length)return"";let d=`M ${pts[0].x} ${pts[0].y}`;for(let i=1;i<pts.length;i++){const a=pts[i-1],b2=pts[i];d+=` Q ${(a.x+b2.x)/2} ${(a.y+b2.y)/2 - 4}, ${b2.x} ${b2.y}`}return d})()} fill="none" stroke="#e59ab8" strokeWidth=".5" strokeDasharray="1.8 2.4" strokeLinecap="round" opacity=".9"/>
      </svg>
      {places.map(p=><button key={p.id} className="marker" style={{left:p.x+"%",top:p.y+"%"}} onClick={()=>setModal({kind:"place",data:p})}><i>♥</i><span>{p.name}</span></button>)}
      <span className="mapHint">点击爱心，打开那个地方的回忆</span>
     </>:<div className="empty">地图还是空白的，等第一个坐标被点亮 ♥</div>}
     {admin&&<button className="mini mapAdd" onClick={()=>openPlaceForm()}>＋ 标记新地点</button>}
    </div></div></section>
   <section id="stories"><div className="wrap"><div className="head"><div><small>OUR STORIES</small><h2>故事还在继续</h2></div><p>以后可以接入 AI，把零散的记忆写成完整的爱情章节。</p></div><div className="cards">{(stories.length?stories:[{title:"我们是怎么认识的",body:"把第一次见面的细节写下来。那时的我们，还不知道后来会一起走这么远。"}]).map((s,i)=><article data-reveal className="glass story" key={s.id||i}><small>CHAPTER {String(i+1).padStart(2,"0")}</small><h3>{s.title}</h3><p>{s.body}</p><button onClick={()=>setModal({kind:"readStory",data:s})}>阅读故事 →</button>{admin&&s.id&&<div className="rowOps"><button onClick={()=>openStory(s)}>编辑</button><button className="danger" onClick={()=>delStory(s.id)}>删除</button></div>}</article>)}</div>{admin&&<button className="primary add" onClick={()=>openStory()}>＋ 写一个新故事</button>}</div></section>
   <section id="letter"><div className="wrap"><div className="head centerHead"><div><small>TO THE FUTURE YOU</small><h2>写给未来的你</h2></div><p>这封信，是写给很多年以后打开这里的我们。</p></div>
    <div className={"envWrap"+(letterOpen?" open":"")}>
     <div className={letterOpen?"envelope open":"envelope"} onClick={()=>setLetterOpen(true)}>
      <div className="envBack"/>
      <div className="envPaper">
       {letterOpen&&(function(){
        const paras=(settings.letter_body||"如果有一天你重新打开这个网站，\n希望你还能记得，\n我们第一次见面的时候……\n那时候的我们，还不知道后来会这么喜欢彼此。").split("\n").filter(t=>t.trim());
        let off=1.7;const starts=paras.map(l=>{const s=off;off+=l.length*.033+.45;return s});
        const signLines=(settings.letter_signoff||"爱你的\n永远在你身边的我").split("\n").filter(Boolean);
        const signStart=off+.6;
        return <div className={"paperInner"+(paperGo?" go":"")}>
         <p className="ltGreet"><Chars text={settings.letter_greeting||"亲爱的你："} start={1.1} step={.04}/></p>
         {paras.map((line,li)=><p key={li} className="ltLine"><Chars text={line} start={starts[li]} step={.033}/></p>)}
         <p className="ltSign">{signLines.map((l,i)=><span key={i}><Chars text={l} start={signStart+i*.55} step={.035}/><br/></span>)}</p>
         <div className="ltEnd" style={{animationDelay:`${signStart+signLines.length*.55+.9}s`}}><i>♥</i><span>还有下一页。</span></div>
         {admin&&<button className="mini ltEdit" onClick={e=>{e.stopPropagation();setForm({lg:settings.letter_greeting||"",lb:settings.letter_body||"",ls:settings.letter_signoff||""});setModal({kind:"letterEdit"})}}>✎ 修改这封信</button>}
        </div>})()}
      </div>
      <div className="envFlap"/>
      <div className="envFront"/>
      <div className="envSeal">♥</div>
     </div>
     {!letterOpen&&<p className="envHint">点击拆开信封 ✉</p>}
    </div>
   </div></section>
   <section id="future"><div className="wrap"><div className="head centerHead"><div><small>OUR FUTURE</small><h2>我们的未来清单</h2></div><p>{wishes.length?`已完成 ${wishes.filter(w=>w.done).length} / ${wishes.length}，剩下的慢慢来。`:"把想一起做的事，一颗颗写下来。"}</p></div>
    <div className="wishCard glass">
     {wishes.map(w=>{const done=!!w.done;return <div key={w.id} className={"wish"+(done?" done":"")}>
      <button className="wishBox" onClick={()=>toggleWish(w)} aria-label="完成愿望">{done?"♥":""}</button>
      <span onClick={()=>toggleWish(w)}>{w.text}</span>
      {admin&&<button className="wishDel" onClick={()=>delWish(w.id)}>×</button>}
     </div>})}
     {!wishes.length&&<p className="empty">愿望清单还是空白的，写下第一颗星星吧 ✨</p>}
     {admin&&<button className="mini addWish" onClick={()=>{setForm({...form,wtext:""});setModal({kind:"wishForm"})}}>＋ 添加我们的愿望</button>}
    </div>
   </div></section>
   <section id="finale">
    <div className="finCore">
     <p className={"finLine"+(fin>=1?" on":"")}>故事写到这里了吗？</p>
     <p className={"finLine big"+(fin>=2?" on":"")}>没有。</p>
     <p className={"finLine"+(fin>=3?" on":"")}>因为下一页，还要和你一起写。</p>
     <div className={"finLove"+(fin>=4?" on":"")}>
      <i>♥</i>
      <b>我爱你</b>
      <span>{today}</span>
      <small>Our Little Universe · 我们爱的小宇宙 · 未完待续</small>
     </div>
    </div>
   </section>
  </main>
  <footer>Made with ♥ for two · Our Little Universe · 我们爱的小宇宙<span className="secretDot" title="♡" onClick={openSecret}>♡</span></footer>

  {modal&&<div className="modal" onClick={()=>!busy&&setModal(null)}><div className={"glass modalBox"+(modal.kind==="album"?" wide":modal.kind==="capsule"?" capsule":"")} onClick={e=>e.stopPropagation()}>
   <button className="close" disabled={busy} onClick={()=>setModal(null)}>×</button>

   {modal.kind==="admin"&&<><h2>管理员入口</h2>
    {admin&&<p className="okline">✓ 当前处于管理模式，可以编辑内容。</p>}
    <p className="muted">Token 只保存在当前浏览器。</p>
    <input className="input" type="password" placeholder={admin?"重新输入密钥可切换账号":"LOVE_ADMIN_TOKEN"} value={tokenInput} onChange={e=>setTokenInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()}/>
    <div className="ops"><button className="primary" disabled={busy} onClick={login}>{busy?"验证中…":"进入管理模式"}</button>{admin&&<button className="danger" onClick={logout}>退出管理</button>}</div></>}

   {modal.kind==="event"&&<><h2>{modal.data.id?"编辑回忆":"添加回忆"}</h2>
    <label className="lbl">日期</label><input className="input" type="date" value={form.event_date||""} onChange={e=>setForm({...form,event_date:e.target.value})}/>
    <label className="lbl">标题</label><input className="input" placeholder="比如：第一次一起看海" value={form.title||""} onChange={e=>setForm({...form,title:e.target.value})}/>
    <label className="lbl">描述</label><textarea className="input" rows={3} placeholder="那一天发生了什么…" value={form.description||""} onChange={e=>setForm({...form,description:e.target.value})}/>
    <label className="lbl">🎵 那天听的歌（可选）</label><input className="input" placeholder="比如：周杰伦《简单爱》" value={form.song||""} onChange={e=>setForm({...form,song:e.target.value})}/>
    <div className="formGrid2">
     <div><label className="lbl">难忘的时刻（可选）</label><input className="input" placeholder="20:36" value={form.moment_time||""} onChange={e=>setForm({...form,moment_time:e.target.value})}/></div>
     <div><label className="lbl">那一刻的感受</label><input className="input" placeholder="海边的风很大" value={form.moment_note||""} onChange={e=>setForm({...form,moment_note:e.target.value})}/></div>
    </div>
    <label className="lbl">图标（不选则按标题自动匹配）</label><div className="emojiRow">{EMOJIS.map(x=><button key={x} type="button" className={form.emoji===x?"on":""} onClick={()=>setForm({...form,emoji:form.emoji===x?"":x})}>{x}</button>)}</div>
    <div className="ops"><button className="primary" disabled={busy} onClick={saveEvent}>{busy?"保存中…":"保存"}</button>{modal.data.id&&<button className="danger" disabled={busy} onClick={()=>delEvent(modal.data.id)}>删除</button>}</div></>}

   {modal.kind==="story"&&<><h2>{modal.data.id?"编辑故事":"写一个新故事"}</h2>
    <label className="lbl">标题</label><input className="input" placeholder="故事的标题" value={form.title||""} onChange={e=>setForm({...form,title:e.target.value})}/>
    <label className="lbl">正文</label><textarea className="input" rows={8} placeholder="慢慢写，不着急…" value={form.body||""} onChange={e=>setForm({...form,body:e.target.value})}/>
    <div className="ops"><button className="primary" disabled={busy} onClick={saveStory}>{busy?"保存中…":"保存"}</button>{modal.data.id&&<button className="danger" disabled={busy} onClick={()=>delStory(modal.data.id)}>删除</button>}</div></>}

   {modal.kind==="readStory"&&<><h2>{modal.data.title}</h2><p className="storyBody">{modal.data.body}</p></>}

   {modal.kind==="upload"&&<><h2>上传照片</h2>
    <p className="muted small">照片会先提交到 GitHub 仓库并触发自动部署（约 1 分钟），随后出现在所属回忆的相册里。</p>
    <label className="dropzone">{file?`📷 ${file.name}（${(file.size/1048576).toFixed(1)}MB）`:"点击选择图片（jpg / png / webp）"}
     <input type="file" accept="image/*" hidden onChange={e=>setFile(e.target.files[0])}/></label>
    <label className="lbl">所属回忆分组</label>
    <select className="input" value={form.event_id||""} onChange={e=>setForm({...form,event_id:e.target.value})}>
     <option value="">未分组</option>
     {events.map(ev=><option key={ev.id} value={ev.id}>{ev.emoji} {ev.title}（{ev.event_date}）</option>)}
    </select>
    <label className="lbl">标题</label><input className="input" placeholder="比如：领证当天的笑容" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
    <label className="lbl">日期</label><input className="input" type="date" value={form.event_date||""} onChange={e=>setForm({...form,event_date:e.target.value})}/>
    <label className="lbl">地点（可选）</label><input className="input" placeholder="比如：天津" value={form.location||""} onChange={e=>setForm({...form,location:e.target.value})}/>
    <label className="lbl">想说的话</label><textarea className="input" rows={2} placeholder="给这张照片配一句话…" value={form.caption} onChange={e=>setForm({...form,caption:e.target.value})}/>
    <div className="ops"><button className="primary" disabled={busy} onClick={uploadPhoto}>{busy?"上传中…":"上传并部署"}</button></div></>}

   {modal.kind==="album"&&(function(){const eid=modal.data;const ev=events.find(x=>x.id===eid);const all=photosByEvent[eid]||[];
    const years=[...new Set(all.map(p=>(p.event_date||"").slice(0,4)).filter(Boolean))];
    const locs=[...new Set(all.map(p=>p.location).filter(Boolean))];
    const list=all.filter(p=>(!fYear||(p.event_date||"").startsWith(fYear))&&(!fLoc||(p.location||"")===fLoc));
    return <><h2>{ev?`${ev.emoji&&ev.emoji!=="♥"?ev.emoji:guessEmoji(ev.title)} ${ev.title}`:"未分组照片"}</h2>
     <p className="muted small">{(ev?`${fmtDate(ev.event_date)} · `:"")+(all.length?`共 ${all.length} 张，点击可看大图`:"这段回忆还没有照片")}</p>
     {admin&&<div className="ops" style={{justifyContent:"flex-start",marginTop:14}}><button onClick={()=>openUpload(eid||"")}>＋ 上传到此分组</button></div>}
     {(years.length>1||locs.length>0)&&<div className="filterRow">
      {years.length>1&&<><span className="chipLbl">年份</span><button className={"chip"+(!fYear?" on":"")} onClick={()=>setFYear("")}>全部</button>{years.map(y=><button key={y} className={"chip"+(fYear===y?" on":"")} onClick={()=>setFYear(fYear===y?"":y)}>{y}</button>)}</>}
      {locs.length>0&&<><span className="chipLbl">地点</span>{locs.map(l=><button key={l} className={"chip"+(fLoc===l?" on":"")} onClick={()=>setFLoc(fLoc===l?"":l)}>{l}</button>)}</>}
     </div>}
     {list.length>0?<div className="albumGrid">{list.map(p=><Ph key={p.id} src={p.public_path} onClick={()=>setLb({list:all,index:all.indexOf(p)})}/>)}</div>
      :<p className="muted">{admin?"点击上方「上传到此分组」添加第一张照片 ♥":"照片即将上线，敬请期待 ♥"}</p>}
    </>})()}

   {modal.kind==="capsule"&&(function(){const ev=events.find(x=>x.id===modal.data)||{};const g=photosByEvent[ev.id]||[];const main=g[0];
    return <>
     <div className="capHead">
      <i className="capHeart">♥</i>
      <h2>{(ev.emoji&&ev.emoji!=="♥"?ev.emoji:guessEmoji(ev.title))+" "}{ev.title}</h2>
      <span className="capYear">{(ev.event_date||"").replaceAll("-",".")}</span>
     </div>
     {main&&g.length>0?<CapCarousel list={g} onOpen={i=>setLb({list:g,index:i})}/>
      :<p className="capLine">这段回忆的照片还在路上 ♥</p>}
     {g.length>1&&<p className="capCount">还有 {g.length-1} 张照片 <button className="mini primary" onClick={()=>openAlbum(ev.id)}>打开相册</button></p>}
     {ev.description&&<p className="capLine">{ev.description}</p>}
     {(function(){const linked=songs.find(s=>s.event_id===ev.id);const li=linked?songs.indexOf(linked):-1;
      if(linked)return <div className="capSong linked"><button className="playMini" onClick={()=>{setPlayerOpen(true);if(cur===li&&pPlaying)setPPlaying(false);else playSong(li)}}>{pPlaying&&cur===li?"⏸":"▶"}</button><div><small>那天听的歌 · 点击播放</small><b>{linked.name}</b></div></div>;
      if(ev.song)return <div className="capSong"><span className="eq"><i/><i/><i/><i/></span><div><small>那天听的歌</small><b>{ev.song}</b></div></div>;
      return null})()}
     {(ev.moment_time||ev.moment_note)&&<div className="capMoment">{ev.moment_time&&<b>{ev.moment_time}</b>}{ev.moment_note&&<p>{ev.moment_note}</p>}</div>}
     <div className="capFoot">♥ ♥ ♥</div>
    </>})()}

   {modal.kind==="placeForm"&&<><h2>{modal.data.id?"编辑地点":"标记新地点"}</h2>
    <label className="lbl">地点名称</label><input className="input" placeholder="比如：秦皇岛" value={form.name||""} onChange={e=>setForm({...form,name:e.target.value})}/>
    <label className="lbl">日期</label><input className="input" type="date" value={form.event_date||""} onChange={e=>setForm({...form,event_date:e.target.value})}/>
    <label className="lbl">那天的故事</label><textarea className="input" rows={2} placeholder="我们第一次一起看海。" value={form.description||""} onChange={e=>setForm({...form,description:e.target.value})}/>
    <label className="lbl">📍 点击下方地图选择位置</label>
    <div className="miniMap" onClick={e=>{const r=e.currentTarget.getBoundingClientRect();setForm({...form,x:Math.min(96,Math.max(4,Math.round((e.clientX-r.left)/r.width*100))),y:Math.min(94,Math.max(6,Math.round((e.clientY-r.top)/r.height*100)))})}}>
     <svg viewBox="0 0 100 100" preserveAspectRatio="none">
      <path d={(()=>{const pts=[...places].sort((a,b)=>(a.event_date||"").localeCompare(b.event_date||"")).filter(p=>p.id!==modal.data.id);if(!pts.length)return"";let d=`M ${pts[0].x} ${pts[0].y}`;for(let i=1;i<pts.length;i++){const a=pts[i-1],b2=pts[i];d+=` Q ${(a.x+b2.x)/2} ${(a.y+b2.y)/2 - 4}, ${b2.x} ${b2.y}`}return d})()} fill="none" stroke="#e59ab8" strokeWidth=".6" strokeDasharray="1.8 2.4" vectorEffect="non-scaling-stroke"/>
     </svg>
     {places.filter(p=>p.id!==modal.data.id).map(p=><i key={p.id} className="mmDot" style={{left:p.x+"%",top:p.y+"%"}}/>)}
     <b style={{left:(form.x||50)+"%",top:(form.y||50)+"%"}}>♥</b>
    </div>
    <div className="formGrid2">
     <div><label className="lbl">横向微调 {form.x??50}%</label><input type="range" min="4" max="96" value={form.x??50} onChange={e=>setForm({...form,x:+e.target.value})} style={{width:"100%"}}/></div>
     <div><label className="lbl">纵向微调 {form.y??50}%</label><input type="range" min="6" max="94" value={form.y??50} onChange={e=>setForm({...form,y:+e.target.value})} style={{width:"100%"}}/></div>
    </div>
    <div className="ops"><button className="primary" disabled={busy} onClick={savePlace}>{busy?"保存中…":"标记到地图"}</button>{modal.data.id&&<button className="danger" disabled={busy} onClick={()=>delPlace(modal.data.id)}>删除</button>}</div></>}

   {modal.kind==="place"&&(function(){const p=modal.data;const g=photos.filter(ph=>ph.location===p.name);const ev=g[0]?events.find(x=>x.id===g[0].event_id):null;
    return <>
     <div className="capHead"><i className="capHeart">♥</i><h2>📍 {p.name}</h2>
      <span className="capYear">{(p.event_date||"").replaceAll("-",".")}</span></div>
     {g.length>0?<div className="albumGrid placeGrid">{g.map((ph,i)=><Ph key={ph.id} src={ph.public_path} onClick={()=>setLb({list:g,index:i})}/>)}</div>
      :<p className="capLine">{p.description}</p>}
     {ev&&<div className="evActions center"><button className="mini primary" onClick={()=>openAlbum(ev.id)}>打开「{ev.title}」的相册（{g.length} 张）</button></div>}
     {p.description&&g.length>0&&<p className="capLine">{p.description}</p>}
     {admin&&<div className="ops center"><button onClick={()=>openPlaceForm(p)}>编辑坐标</button><button className="danger" onClick={()=>delPlace(p.id)}>删除地点</button></div>}
    </>})()}

   {modal.kind==="musicUp"&&<><h2>上传歌曲</h2>
    <p className="muted small">音频会提交到 GitHub 仓库并自动部署（约 1 分钟后可播放）。</p>
    <label className="dropzone">{file?`🎵 ${file.name}（${(file.size/1048576).toFixed(1)}MB）`:"点击选择音频（mp3 / m4a / wav）"}
     <input type="file" accept="audio/*" hidden onChange={e=>{setFile(e.target.files[0]);setForm({...form,name:e.target.files[0].name.replace(/\.[^.]+$/,"")})}}/></label>
    <label className="lbl">歌名</label><input className="input" placeholder="比如：我们的主题曲" value={form.name||""} onChange={e=>setForm({...form,name:e.target.value})}/>
    <label className="lbl">关联回忆（可选，胶囊里可以直接播放）</label>
    <select className="input" value={form.event_id||""} onChange={e=>setForm({...form,event_id:e.target.value})}>
     <option value="">不关联</option>
     {events.map(ev=><option key={ev.id} value={ev.id}>{ev.emoji||"♥"} {ev.title}</option>)}
    </select>
    <div className="ops"><button className="primary" disabled={busy} onClick={uploadSong}>{busy?"上传中…":"上传并部署"}</button></div></>}

   {modal.kind==="secretAsk"&&<><h2>🔐 只有我们知道</h2>
    <p className="capLine" style={{marginTop:14}}>{settings.secret_q||"（还没有设置秘密问题）"}</p>
    <input className="input" style={{textAlign:"center"}} placeholder="请输入只有我们知道的答案" value={secAns} onChange={e=>setSecAns(e.target.value)} onKeyDown={e=>e.key==="Enter"&&checkSecret()}/>
    {secErr&&<p className="shakeTxt">{secErr}</p>}
    <div className="ops"><button className="primary" disabled={busy} onClick={checkSecret}>{busy?"验证中…":"解锁 ♥"}</button></div></>}

   {modal.kind==="secretView"&&<><div className="capHead"><i className="capHeart">♥</i><h2>密码正确 ♥</h2><span className="capYear">只有我们知道</span></div>
    {settings.secret_photo&&<img className="capPhoto" src={settings.secret_photo}/>}
    {(settings.secret_note||"").split("\n").filter(t=>t.trim()).map((l,i)=><p key={i} className="capLine">{l}</p>)}
    {!settings.secret_note&&!settings.secret_photo&&<p className="capLine">这里将藏起一件只属于我们的小秘密。</p>}
    <div className="ops center">
     {admin&&<button onClick={()=>openSecretEdit()}>✎ 修改秘密</button>}
     <button className="danger" onClick={relock}>🔒 重新上锁</button>
    </div></>}

   {modal.kind==="secretEdit"&&<><h2>✎ 设置我们的秘密</h2>
    <label className="lbl">问题（比如：第一次一起吃的那家店叫什么？）</label><input className="input" value={form.sq||""} onChange={e=>setForm({...form,sq:e.target.value})}/>
    <label className="lbl">答案（不用区分大小写）</label><input className="input" value={form.sa||""} onChange={e=>setForm({...form,sa:e.target.value})}/>
    <label className="lbl">解锁后的照片（可选）</label>
    <select className="input" value={form.sp||""} onChange={e=>setForm({...form,sp:e.target.value})}>
     <option value="">不展示照片</option>
     {photos.map(p=><option key={p.id} value={p.public_path}>{(p.title||p.public_path)+(p.event_date?` · ${p.event_date}`:"")}</option>)}
    </select>
    <label className="lbl">想说的话（每行一句，可选）</label><textarea className="input" rows={4} value={form.sn||""} onChange={e=>setForm({...form,sn:e.target.value})}/>
    <div className="ops"><button className="primary" disabled={busy} onClick={saveSecret}>{busy?"封存中…":"封存秘密"}</button></div></>}

   {modal.kind==="wishForm"&&<><h2>添加我们的愿望</h2>
    <p className="muted small">写下一个想一起完成的心愿，完成后点亮它。</p>
    <input className="input" placeholder="比如：一起去看一次极光" value={form.wtext||""} onChange={e=>setForm({...form,wtext:e.target.value})} onKeyDown={e=>e.key==="Enter"&&addWish()}/>
    <div className="ops"><button className="primary" disabled={busy} onClick={addWish}>加入清单 ✨</button></div></>}

   {modal.kind==="letterEdit"&&<><h2>修改这封信</h2>
    <label className="lbl">称呼</label><input className="input" placeholder="亲爱的你：" value={form.lg||""} onChange={e=>setForm({...form,lg:e.target.value})}/>
    <label className="lbl">正文（每行一句）</label><textarea className="input" rows={8} value={form.lb||""} onChange={e=>setForm({...form,lb:e.target.value})}/>
    <label className="lbl">落款（每行一行）</label><textarea className="input" rows={2} value={form.ls||""} onChange={e=>setForm({...form,ls:e.target.value})}/>
    <div className="ops"><button className="primary" disabled={busy} onClick={saveLetter}>{busy?"封存中…":"重新封好"}</button></div></>}

   {modal.kind==="photoMeta"&&<><h2>编辑照片信息</h2>
    <img className="modalImg slim" src={modal.data.public_path}/>
    <label className="lbl">标题</label><input className="input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
    <label className="lbl">所属回忆分组</label>
    <select className="input" value={form.event_id||""} onChange={e=>setForm({...form,event_id:e.target.value})}>
     <option value="">未分组</option>
     {events.map(ev=><option key={ev.id} value={ev.id}>{ev.emoji} {ev.title}（{ev.event_date}）</option>)}
    </select>
    <label className="lbl">日期</label><input className="input" type="date" value={form.event_date||""} onChange={e=>setForm({...form,event_date:e.target.value})}/>
    <label className="lbl">地点（可选）</label><input className="input" placeholder="比如：天津" value={form.location||""} onChange={e=>setForm({...form,location:e.target.value})}/>
    <label className="lbl">想说的话</label><textarea className="input" rows={2} value={form.caption} onChange={e=>setForm({...form,caption:e.target.value})}/>
    <div className="ops"><button className="primary" disabled={busy} onClick={savePhotoMeta}>{busy?"保存中…":"保存"}</button><button className="danger" disabled={busy} onClick={()=>delPhoto(modal.data)}>删除照片</button></div></>}
  </div></div>}

  {lb&&(function(){const p=lb.list[lb.index];
   return <div className="lightbox" onClick={()=>setLb(null)}>
    <button className="lbBtn close" onClick={()=>setLb(null)}>×</button>
    {lb.list.length>1&&<button className="lbBtn prev" onClick={e=>{e.stopPropagation();setLb({...lb,index:(lb.index-1+lb.list.length)%lb.list.length})}}>‹</button>}
    <figure onClick={e=>e.stopPropagation()}>
     <img src={p.public_path} alt={p.title||""}/>
     <figcaption><b>{p.title||"我们的瞬间"}</b>{p.location?` · ${p.location}`:""}{p.caption?` — ${p.caption}`:""} · {lb.index+1}/{lb.list.length}</figcaption>
     {admin&&<div className="ops center"><button onClick={()=>{setLb(null);openPhotoMeta(p)}}>编辑信息</button><button className="danger" disabled={busy} onClick={()=>delPhoto(p)}>删除照片</button></div>}
    </figure>
    {lb.list.length>1&&<button className="lbBtn next" onClick={e=>{e.stopPropagation();setLb({...lb,index:(lb.index+1)%lb.list.length})}}>›</button>}
   </div>})()}

  {songs.length>0&&<>
   <audio ref={audioRef} preload="none" onEnded={()=>playSong(cur+1)}/>
   <button className={"musicBtn"+(pPlaying?" on":"")} onClick={()=>{setPlayerOpen(o=>!o);if(cur<0)playSong(0)}}>♫</button>
   {playerOpen&&<div className="playerCard glass">
    <b>🎵 我们的歌</b>
    <p className="plNow">{cur>=0?songs[cur].name:"选择一首开始播放"}</p>
    <div className="prog" onClick={seek}><i style={{width:(pDur?pPos/pDur*100:0)+"%"}}/></div>
    <div className="plTimes"><span>{fmtT(pPos)}</span><span>{fmtT(pDur)}</span></div>
    <div className="plCtl">
     <button onClick={()=>playSong(cur-1)}>◀</button>
     <button className="play" onClick={()=>{if(cur<0)return playSong(0);setPPlaying(p=>!p)}}>{pPlaying?"⏸":"▶"}</button>
     <button onClick={()=>playSong(cur+1)}>▶</button>
    </div>
    <div className="plList">{songs.map((s,i)=><div key={s.id} className={"plRow"+(i===cur?" on":"")}>
     <span onClick={()=>playSong(i)}>{s.name}</span>
     {admin&&<button onClick={()=>delSong(s)}>×</button>}
    </div>)}</div>
    {admin&&<label className="mini plUp">＋ 上传歌曲<input type="file" accept="audio/*" hidden onChange={e=>{setFile(e.target.files[0]);setForm({name:e.target.files[0].name.replace(/\.[^.]+$/,""),event_id:""});setModal({kind:"musicUp"})}}/></label>}
   </div>}
  </>}
  <button className={"toTop"+(showTop?" show":"")} onClick={()=>window.scrollTo({top:0,behavior:"smooth"})} aria-label="回到顶部">↑</button>
  {toast&&<div className="toast">{toast}</div>}
 </div>
}
createRoot(document.getElementById("root")).render(<Boundary><App/></Boundary>);
