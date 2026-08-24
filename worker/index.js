function json(data, status=200) {
  return new Response(JSON.stringify(data), {status, headers: {"content-type":"application/json; charset=utf-8", "cache-control":"no-store"}});
}
function admin(request, env){
  const token=request.headers.get("authorization")?.replace(/^Bearer\s+/i,"");
  return Boolean(token && env.LOVE_ADMIN_TOKEN && token===env.LOVE_ADMIN_TOKEN);
}
const RL=new Map();
function limited(request, key, max, ms){
  const ip=request.headers.get("cf-connecting-ip")||"local";
  const k=ip+"|"+key, now=Date.now();
  const arr=(RL.get(k)||[]).filter(t=>now-t<ms);
  if(arr.length>=max){RL.set(k,arr);return true}
  arr.push(now);RL.set(k,arr);
  if(RL.size>5000)RL.clear();
  return false;
}
const NO_CACHE={headers:{"cache-control":"no-cache"}, cf:{cacheTtl:0, cacheEverything:false}};
async function gh(env, path, options={}){
  return fetch(`https://api.github.com/repos/${env.GITHUB_REPO}${path}`, {
    ...options,
    headers:{authorization:`Bearer ${env.GITHUB_TOKEN}`, accept:"application/vnd.github+json", "content-type":"application/json", "user-agent":"our-little-universe", ...(options.headers||{})},
    ...(options.cf?{cf:options.cf}:{})
  });
}
async function ghGetSha(env, ghPath){
  const g=await gh(env, `/contents/${ghPath}?ref=main&t=${Date.now()}`, NO_CACHE);
  if(g.status===404) return null;
  if(!g.ok) throw new Error(`github_get_failed:${g.status}`);
  return (await g.json()).sha;
}
async function ghPutFile(env, ghPath, contentB64, message){
  for(let i=0;i<3;i++){
    try{
      const sha=await ghGetSha(env, ghPath);
      const r=await gh(env, `/contents/${ghPath}`, {method:"PUT", body:JSON.stringify({message, content:contentB64, branch:"main", ...(sha?{sha}:{})})});
      if(r.ok) return true;
      if(r.status>=500) continue;
      const err=await r.json().catch(()=>({}));
      if(r.status===409 || r.status===422) continue;
      throw new Error(`github_put_failed:${r.status}:${err.message||""}`);
    }catch(e){ if(i===2 && String(e.message).startsWith("github_put")) throw e; }
  }
  return false;
}
async function ghDeleteFile(env, ghPath){
  for(let i=0;i<3;i++){
    try{
      const sha=await ghGetSha(env, ghPath);
      if(sha===null) return true;
      const r=await gh(env, `/contents/${ghPath}`, {method:"DELETE", body:JSON.stringify({message:`chore: remove ${ghPath}`, sha, branch:"main"})});
      if(r.ok) return true;
      if(r.status===404) return true;
    }catch(e){}
  }
  return false;
}

async function route(request, env) {
  const url=new URL(request.url), path=url.pathname, method=request.method;
  const seg=path.split("/").filter(Boolean), res=seg[1], id=seg[2];
  if(!path.startsWith("/api/")) return env.ASSETS.fetch(request);
  if(path==="/api/health") return json({ok:true, service:"our-little-universe", time:new Date().toISOString()});
  if(path==="/api/admin/check"){
    if(!admin(request, env)) return json({error:"unauthorized"},401);
    return json({ok:true});
  }

  if(res==="settings" && method==="GET"){
    const {results}=await env.LOVE_DB.prepare("SELECT key,value FROM settings WHERE key NOT LIKE 'secret_%'").all();
    return json(Object.fromEntries(results.map(x=>[x.key,x.value])));
  }
  if(path==="/api/secret/config"){
    if(!admin(request, env)) return json({error:"unauthorized"},401);
    const {results}=await env.LOVE_DB.prepare("SELECT key,value FROM settings WHERE key LIKE 'secret_%'").all();
    return json(Object.fromEntries(results.map(x=>[x.key,x.value])));
  }
  if(path==="/api/secret/check"){
    if(limited(request,"sec",6,60000)) return json({error:"rate_limited"},429);
    const b=await request.json().catch(()=>({}));
    const row=await env.LOVE_DB.prepare("SELECT value FROM settings WHERE key='secret_a'").first();
    const ans=(row?.value||"").trim().toLowerCase();
    if(!ans) return json({error:"not_set"},404);
    const ok=((b.answer||"").trim().toLowerCase()===ans);
    return json({ok},ok?200:401);
  }
  if(path==="/api/secret/contents" && method==="GET"){
    const b=await request.json().catch(()=>({}));
    const given=request.headers.get("x-secret")||"";
    const row=await env.LOVE_DB.prepare("SELECT value FROM settings WHERE key='secret_a'").first();
    const ans=(row?.value||"").trim().toLowerCase();
    if(!ans || given.trim().toLowerCase()!==ans) return json({error:"locked"},401);
    const {results}=await env.LOVE_DB.prepare("SELECT * FROM secret_contents ORDER BY created_at DESC").all();
    return json(results);
  }
  if(res==="secret" && seg[2]==="contents" && method==="POST"){
    if(!admin(request, env)) return json({error:"unauthorized"},401);
    const nid=crypto.randomUUID();
    await env.LOVE_DB.prepare("INSERT INTO secret_contents(id,type,title,content,media_path) VALUES(?,?,?,?,?)")
      .bind(nid,b.type||"note",(b.title||"").slice(0,80),b.content||"",b.media_path||"").run();
    return json({id:nid},201);
  }
  if(res==="secret" && seg[2]==="contents" && method==="DELETE" && seg[3]){
    if(!admin(request, env)) return json({error:"unauthorized"},401);
    await env.LOVE_DB.prepare("DELETE FROM secret_contents WHERE id=?").bind(seg[3]).run();
    return json({ok:true});
  }
  if(res==="timeline" && method==="GET"){
    const {results}=await env.LOVE_DB.prepare("SELECT * FROM timeline_events ORDER BY event_date ASC").all();
    return json(results);
  }
  if(res==="stories" && method==="GET"){
    const {results}=await env.LOVE_DB.prepare("SELECT * FROM stories ORDER BY created_at DESC").all();
    return json(results);
  }
  if(res==="photos" && method==="GET" && !id){
    const {results}=await env.LOVE_DB.prepare("SELECT * FROM photos ORDER BY created_at DESC").all();
    return json(results);
  }
  if(res==="places" && method==="GET"){
    const {results}=await env.LOVE_DB.prepare("SELECT * FROM places ORDER BY event_date ASC").all();
    return json(results);
  }
  if(res==="songs" && method==="GET"){
    const {results}=await env.LOVE_DB.prepare("SELECT * FROM songs ORDER BY created_at ASC").all();
    return json(results);
  }
  if(res==="wishes" && method==="GET"){
    const {results}=await env.LOVE_DB.prepare("SELECT * FROM wishes ORDER BY created_at ASC").all();
    return json(results);
  }

  if(method!=="POST" && method!=="PUT" && method!=="DELETE") return json({error:"not_found"},404);
  if(!admin(request, env)) return json({error:"unauthorized"},401);
  if(limited(request,"adm",30,60000)) return json({error:"rate_limited"},429);
  const b = (method!=="DELETE") ? await request.json().catch(()=>({})) : {};

  if(res==="timeline" && method==="POST" && !id){
    if(!b.event_date || !b.title) return json({error:"日期和标题不能为空"},400);
    const nid=crypto.randomUUID();
    await env.LOVE_DB.prepare("INSERT INTO timeline_events(id,event_date,title,description,emoji,song,moment_time,moment_note) VALUES(?,?,?,?,?,?,?,?)")
      .bind(nid,b.event_date,b.title,b.description||"",b.emoji||null,b.song||null,b.moment_time||null,b.moment_note||null).run();
    return json({id:nid},201);
  }
  if(res==="timeline" && method==="PUT" && id){
    await env.LOVE_DB.prepare("UPDATE timeline_events SET event_date=?1,title=?2,description=?3,emoji=?4,song=?5,moment_time=?6,moment_note=?7 WHERE id=?8")
      .bind(b.event_date,b.title,b.description??"",b.emoji??null,b.song??null,b.moment_time??null,b.moment_note??null,id).run();
    return json({ok:true});
  }
  if(res==="timeline" && method==="DELETE" && id){
    await env.LOVE_DB.prepare("DELETE FROM timeline_events WHERE id=?").bind(id).run();
    return json({ok:true});
  }

  if(res==="stories" && method==="POST" && !id){
    if(!b.title || !b.body) return json({error:"标题和内容不能为空"},400);
    const nid=crypto.randomUUID();
    await env.LOVE_DB.prepare("INSERT INTO stories(id,title,body) VALUES(?,?,?)").bind(nid,b.title,b.body).run();
    return json({id:nid},201);
  }
  if(res==="stories" && method==="PUT" && id){
    await env.LOVE_DB.prepare("UPDATE stories SET title=?1,body=?2,updated_at=CURRENT_TIMESTAMP WHERE id=?3")
      .bind(b.title,b.body,id).run();
    return json({ok:true});
  }
  if(res==="stories" && method==="DELETE" && id){
    await env.LOVE_DB.prepare("DELETE FROM stories WHERE id=?").bind(id).run();
    return json({ok:true});
  }

  if(res==="photos" && method==="POST" && id==="upload"){
    const safe=(b.filename||"").toLowerCase().replace(/[^a-z0-9._-]+/g,"-").replace(/^[-.]+/,"").slice(0,80);
    if(!/\.(jpe?g|png|webp|gif|avif)$/.test(safe)) return json({error:"仅支持 jpg/png/webp/gif/avif 图片"},400);
    if(!b.content || b.content.length>30*1024*1024) return json({error:"文件过大（上限约 22MB）"},413);
    const ghPath=`public/photos/${safe}`;
    let ok=false;
    try{ ok=await ghPutFile(env, ghPath, b.content, `photo: ${safe}`); }catch(e){ ok=false; }
    if(!ok) return json({error:"推送到 GitHub 失败，请稍后重试或检查 GITHUB_TOKEN 权限"},502);
    const public_path=`/photos/${safe}`;
    const pid=crypto.randomUUID();
    await env.LOVE_DB.prepare("INSERT INTO photos(id,public_path,title,caption,event_date,event_id,location) VALUES(?,?,?,?,?,?,?) ON CONFLICT(public_path) DO UPDATE SET title=excluded.title,caption=excluded.caption,event_date=excluded.event_date,event_id=excluded.event_id,location=excluded.location")
      .bind(pid,public_path,b.title||"",b.caption||"",b.event_date||null,b.event_id||null,b.location||null).run();
    const row=await env.LOVE_DB.prepare("SELECT id FROM photos WHERE public_path=?").bind(public_path).first();
    return json({id:row.id, public_path},201);
  }
  if(res==="photos" && method==="PUT" && id){
    await env.LOVE_DB.prepare("UPDATE photos SET title=?1,caption=?2,event_date=?3,event_id=?4,location=?5 WHERE id=?6")
      .bind(b.title??"",b.caption??"",b.event_date||null,b.event_id||null,b.location||null,id).run();
    return json({ok:true});
  }
  if(res==="photos" && method==="DELETE" && id){
    const row=await env.LOVE_DB.prepare("SELECT public_path FROM photos WHERE id=?").bind(id).first();
    if(!row) return json({error:"not_found"},404);
    const removed=await ghDeleteFile(env, `public${row.public_path}`);
    if(!removed) return json({error:"仓库文件删除失败，请稍后重试"},502);
    await env.LOVE_DB.prepare("DELETE FROM photos WHERE id=?").bind(id).run();
    return json({ok:true, repo_file_removed:true});
  }

  if(res==="places" && method==="POST" && !id){
    if(!b.name) return json({error:"地点名称不能为空"},400);
    const nid=crypto.randomUUID();
    await env.LOVE_DB.prepare("INSERT INTO places(id,name,event_date,description,x,y) VALUES(?,?,?,?,?,?)")
      .bind(nid,b.name,b.event_date||null,b.description||"",b.x??50,b.y??50).run();
    return json({id:nid},201);
  }
  if(res==="places" && method==="PUT" && id){
    await env.LOVE_DB.prepare("UPDATE places SET name=?1,event_date=?2,description=?3,x=?4,y=?5 WHERE id=?6")
      .bind(b.name??"",b.event_date||null,b.description??"",b.x??50,b.y??50,id).run();
    return json({ok:true});
  }
  if(res==="places" && method==="DELETE" && id){
    await env.LOVE_DB.prepare("DELETE FROM places WHERE id=?").bind(id).run();
    return json({ok:true});
  }
  if(res==="songs" && method==="POST" && id==="upload"){
    const safe=(b.filename||"").toLowerCase().replace(/[^a-z0-9._-]+/g,"-").replace(/^[-.]+/,"").slice(0,80);
    if(!/\.(mp3|m4a|wav|ogg|flac)$/.test(safe)) return json({error:"仅支持 mp3/m4a/wav/ogg/flac 音频"},400);
    if(!b.content || b.content.length>40*1024*1024) return json({error:"文件过大（上限约 30MB）"},413);
    const ok=await ghPutFile(env,`public/music/${safe}`,b.content,`song: ${safe}`);
    if(!ok) return json({error:"推送到 GitHub 失败，请稍后重试"},502);
    const nid=crypto.randomUUID();
    await env.LOVE_DB.prepare("INSERT INTO songs(id,name,file_path,event_id) VALUES(?,?,?,?)")
      .bind(nid,b.name||safe,`/music/${safe}`,b.event_id||null).run();
    return json({id:nid,file_path:`/music/${safe}`},201);
  }
  if(res==="songs" && method==="DELETE" && id){
    const row=await env.LOVE_DB.prepare("SELECT file_path FROM songs WHERE id=?").bind(id).first();
    if(row) await ghDeleteFile(env,row.file_path.replace(/^\//,""));
    await env.LOVE_DB.prepare("DELETE FROM songs WHERE id=?").bind(id).run();
    return json({ok:true});
  }

  if(res==="settings" && method==="PUT"){
    for(const [k,v] of Object.entries(b||{}))
      await env.LOVE_DB.prepare("INSERT INTO settings(key,value,updated_at) VALUES(?,?,CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=CURRENT_TIMESTAMP").bind(k,String(v??"")).run();
    return json({ok:true});
  }
  if(res==="wishes" && method==="POST" && !id){
    if(!b.text) return json({error:"愿望内容不能为空"},400);
    const nid=crypto.randomUUID();
    await env.LOVE_DB.prepare("INSERT INTO wishes(id,text) VALUES(?,?)").bind(nid,b.text).run();
    return json({id:nid},201);
  }
  if(res==="wishes" && method==="PUT" && id){
    await env.LOVE_DB.prepare("UPDATE wishes SET text=?1,done=?2 WHERE id=?3").bind(b.text??"",b.done?1:0,id).run();
    return json({ok:true});
  }
  if(res==="wishes" && method==="DELETE" && id){
    await env.LOVE_DB.prepare("DELETE FROM wishes WHERE id=?").bind(id).run();
    return json({ok:true});
  }

  return json({error:"not_found"},404);
}
export default { fetch: (request, env, ctx) => route(request, env).catch(e=>json({error:"internal_error"},500)) };
