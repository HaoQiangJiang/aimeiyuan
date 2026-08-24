let TOKEN=localStorage.getItem("loveAdminToken")||"";
export const getToken=()=>TOKEN;
export const setToken=t=>{TOKEN=t;localStorage.setItem("loveAdminToken",t)};
export const clearToken=()=>{TOKEN="";localStorage.removeItem("loveAdminToken")};

export async function api(path,options={}){
  const r=await fetch(path,{...options,headers:{"content-type":"application/json",authorization:`Bearer ${getToken()}`,...(options.headers||{})}});
  const d=await r.json().catch(()=>({}));
  if(!r.ok){
    if(r.status===401)throw new Error("管理密钥无效，请重新登录管理员");
    throw new Error(d.error||`请求失败(${r.status})`);
  }
  return d;
}

export const toThumb=p=>p&&p.startsWith("/photos/")?"/photos-thumb/"+p.slice(8):p;
