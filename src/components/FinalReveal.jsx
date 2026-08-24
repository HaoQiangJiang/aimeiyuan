import {useEffect,useState} from "react";
import {AnimatePresence,motion} from "framer-motion";

export default function FinalReveal({startDate,today}){
  const [open,setOpen]=useState(false);
  const [p,setP]=useState(0);
  useEffect(()=>{
    if(!open)return;
    document.body.style.overflow="hidden";
    const ts=[setTimeout(()=>setP(1),1100),setTimeout(()=>setP(2),2700),setTimeout(()=>setP(3),4300),setTimeout(()=>setP(4),5900)];
    return()=>{ts.forEach(clearTimeout);document.body.style.overflow=""};
  },[open]);
  const close=()=>{setOpen(false);setP(0)};
  return <section id="finale">
    <div className="finTease">
      <p>你已到达故事的最后一页</p>
      <button className="finOpen" onClick={()=>setOpen(true)}>翻开终章 ♥</button>
    </div>
    <AnimatePresence>
      {open&&<motion.div className="finOverlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.8}}>
        <button className="finClose" onClick={close}>×</button>
        <div className="finStage">
          <motion.p className="fl l1" initial={{opacity:0,y:14}} animate={{opacity:p>=1?1:.9,y:0}} transition={{duration:1}}>
            故事写到这里了吗？
          </motion.p>
          <motion.p className="fl l2" initial={{opacity:0}} animate={{opacity:p>=2?1:0,scale:p>=2?1:.94}} transition={{duration:1}}>
            没有。
          </motion.p>
          <motion.p className="fl l3" initial={{opacity:0,y:12}} animate={{opacity:p>=3?1:0,y:0}} transition={{duration:1}}>
            下一页，还要和你一起写。
          </motion.p>
          <motion.div className="flEnd" initial={{opacity:0}} animate={{opacity:p>=4?1:0}} transition={{duration:1.4}}>
            <i>♥</i>
            <b>我爱你</b>
            <div className="finDates">
              <span>{startDate.replaceAll("-",".")}</span>
              <em>↓</em>
              <span>{today}</span>
              <em>↓</em>
              <span className="forever">FOREVER</span>
            </div>
            <small>Our Little Universe · 我们爱的小宇宙 · 未完待续</small>
          </motion.div>
        </div>
      </motion.div>}
    </AnimatePresence>
  </section>;
}
