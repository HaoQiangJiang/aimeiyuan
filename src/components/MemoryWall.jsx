import {useState} from "react";
import {Ph} from "./ui.jsx";

export default function MemoryWall({photos,admin,onOpen,onEdit}){
  const [all,setAll]=useState(false);
  const list=all?photos:photos.slice(0,18);
  return <section id="wall"><div className="wrap">
    <div className="head centerHead"><div><small>MEMORY WALL</small><h2>我们的记忆墙</h2></div><p>每一张，都别在时光的软木板上。</p></div>
    <div className="polaroids">
      {list.map((p,i)=>{
        const rot=((i*137)%9)-4;
        return <figure key={p.id} className="polaroid" style={{"--r":rot+"deg"}} onClick={()=>onOpen(i)}>
          <span className="poloImg"><Ph src={p.public_path}/>{admin&&<button className="editBadge" onClick={e=>{e.stopPropagation();onEdit(p)}}>✎</button>}</span>
          <figcaption>
            <b>{p.title||"我们的瞬间"}</b>
            <span>{(p.event_date||"").replaceAll("-",".")}{p.location?` · ${p.location}`:""}</span>
          </figcaption>
        </figure>})}
    </div>
    {photos.length>18&&!all&&<div className="seeAllWrap"><button className="mini primary" onClick={()=>setAll(true)}>展开全部 {photos.length} 张</button></div>}
   </div></section>;
}
