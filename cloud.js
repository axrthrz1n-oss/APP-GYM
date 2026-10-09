/* Ficha de Treino: conta e nuvem (opcional).
   Liga quando config.js tem a URL e a chave pública de um projeto Supabase.
   Oferece ao app as mesmas capacidades que ele usa quando roda no Claude:
   use("db") para os registros, use("user") para a conta e use("sample") para o personal virtual. */
(function(){
"use strict";
const cfg = window.FICHA_CLOUD || {};
const URL_ = String(cfg.url || "").trim().replace(/\/+$/, "");
const KEY = String(cfg.anonKey || "").trim();
const FN = String(cfg.personalFunction || "personal");
const ENABLED = /^https:\/\/\S+$/.test(URL_) && KEY.length > 20;
const AUTH_KEY = "ficha-auth-v1";
const LIB = "vendor/supabase-js-2.117.3.js";
const TABLE = "user_docs";

function fail(code, message){ const e = new Error(message || code); e.code = code; return e; }
/* traduz os erros do Supabase para os códigos que o app já trata */
function mapErr(error, status){
  if (!status || !navigator.onLine) return fail("unavailable", error && error.message);
  if (status === 413 || (error && error.code === "23514")) return fail("quota_exceeded", error && error.message);
  if (status === 401 || status >= 500) return fail("unavailable", error && error.message);
  return fail("unknown", error && error.message);
}

/* ---------- biblioteca e cliente ---------- */
let libPromise = null, sbPromise = null;
function loadLib(){
  if (window.supabase && window.supabase.createClient) return Promise.resolve(window.supabase);
  if (!libPromise){
    libPromise = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = LIB; s.async = true;
      s.onload = () => window.supabase && window.supabase.createClient ? resolve(window.supabase) : reject(fail("unavailable"));
      s.onerror = () => { libPromise = null; s.remove(); reject(fail("unavailable")); };
      document.head.appendChild(s);
    });
  }
  return libPromise;
}
function client(){
  if (!ENABLED) return Promise.reject(fail("not_declared"));
  if (!sbPromise){
    const p = loadLib().then(m => m.createClient(URL_, KEY, {
      auth:{storageKey:AUTH_KEY, persistSession:true, autoRefreshToken:true, detectSessionInUrl:false}
    }));
    sbPromise = p;
    p.catch(() => { if (sbPromise === p) sbPromise = null; });
  }
  return sbPromise;
}
function hasSession(){ try{ return !!localStorage.getItem(AUTH_KEY); }catch(e){ return false; } }
async function session(){
  const sb = await client();
  const { data } = await sb.auth.getSession();
  return (data && data.session) || null;
}

/* ---------- registros (mesma forma do banco do Claude: doc, collection, set, onSnapshot) ---------- */
function makeDb(sb, uid){
  const base = `data/users/${uid}/`;
  const rel = path => {
    path = String(path);
    if (path.indexOf(base) !== 0 || path.length === base.length) throw fail("not_granted", "caminho fora da conta");
    return path.slice(base.length);
  };
  const likeEsc = s => s.replace(/[\\%_]/g, "\\$&");
  let writeSeq = 0, channel = null, pokeTimer = null;
  const listeners = new Set();
  const poke = () => { clearTimeout(pokeTimer); pokeTimer = setTimeout(() => listeners.forEach(l => l.run()), 250); };
  window.addEventListener("online", poke);
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") poke(); });
  function watch(){
    if (channel) return;
    try{
      channel = sb.channel(`ficha-${uid}`)
        .on("postgres_changes", {event:"*", schema:"public", table:TABLE, filter:`user_id=eq.${uid}`}, poke)
        .subscribe();
    }catch(e){ channel = null; }
  }
  /* busca de novo a cada mudança no banco; se uma gravação terminou no meio da busca, o resultado já está velho */
  function listen(fetchSnap, next, onError, reportError){
    let stopped = false, running = false, again = false, reported = false, retry = null;
    const l = {run};
    async function run(){
      if (stopped) return;
      if (running){ again = true; return; }
      running = true; clearTimeout(retry);
      const seq = writeSeq;
      try{
        const snap = await fetchSnap();
        if (!stopped){ if (seq !== writeSeq) again = true; else next(snap); }
      }catch(e){
        if (!stopped){
          if (reportError && !reported && onError){ reported = true; try{ onError(e); }catch(_){} }
          retry = setTimeout(run, navigator.onLine ? 5000 : 15000);
        }
      }finally{
        running = false;
        if (again && !stopped){ again = false; run(); }
      }
    }
    listeners.add(l); watch(); run();
    return () => { stopped = true; clearTimeout(retry); listeners.delete(l); };
  }
  function docRef(path){
    const p = rel(path), id = p.split("/").pop();
    return {
      id,
      collection: name => colRef(`${path}/${name}`),
      async set(data){
        const row = {user_id:uid, path:p, data:JSON.parse(JSON.stringify(data)), updated_at:new Date().toISOString()};
        const { error, status } = await sb.from(TABLE).upsert(row, {onConflict:"user_id,path"});
        if (error) throw mapErr(error, status);
        writeSeq++;
      },
      async delete(){
        const { error, status } = await sb.from(TABLE).delete().eq("user_id", uid).eq("path", p);
        if (error) throw mapErr(error, status);
        writeSeq++;
      },
      /* documentos avisam a primeira falha (o app sai do "carregando"); coleções só tentam de novo */
      onSnapshot(next, onError){
        return listen(async () => {
          const { data, error, status } = await sb.from(TABLE).select("data").eq("user_id", uid).eq("path", p).maybeSingle();
          if (error) throw mapErr(error, status);
          return {id, exists:!!data, data:() => (data ? data.data : undefined)};
        }, next, onError, true);
      }
    };
  }
  function colRef(path){
    const prefix = rel(path) + "/";
    const ref = {
      doc: id => docRef(`${path}/${id}`),
      orderBy: () => ref,
      limit: () => ref,
      onSnapshot(next, onError){
        return listen(async () => {
          const { data, error, status } = await sb.from(TABLE).select("path,data")
            .eq("user_id", uid).like("path", likeEsc(prefix) + "%")
            .order("updated_at", {ascending:false}).range(0, 999);
          if (error) throw mapErr(error, status);
          const docs = (data || [])
            .filter(r => r.path.indexOf(prefix) === 0 && r.path.indexOf("/", prefix.length) < 0)
            .map(r => ({id:r.path.slice(prefix.length), data:() => r.data}));
          return {docs, size:docs.length, empty:!docs.length};
        }, next, onError, false);
      }
    };
    return ref;
  }
  return {doc:docRef, collection:colRef};
}

/* ---------- personal virtual: chama a função "personal" e lê a resposta aos poucos ---------- */
function makeSample(sb){
  return async function sample(messages, opts){
    opts = opts || {};
    const s = (await sb.auth.getSession()).data.session;
    if (!s) throw fail("session_expired");
    let res;
    try{
      res = await fetch(`${URL_}/functions/v1/${FN}`, {
        method:"POST",
        headers:{"Content-Type":"application/json", "Authorization":`Bearer ${s.access_token}`, "apikey":KEY},
        body:JSON.stringify({messages}),
        signal:opts.signal
      });
    }catch(e){ throw fail(e && e.name === "AbortError" ? "cancelled" : "unavailable"); }
    if (!res.ok || !res.body){
      const st = res.status;
      throw fail(st === 401 ? "session_expired" : st === 402 ? "subscription_required" : st === 429 ? "rate_limited" : st === 413 ? "prompt_too_large" : st === 404 || st === 503 ? "sampling_disabled" : "unavailable");
    }
    const reader = res.body.getReader(), dec = new TextDecoder();
    let buf = "", text = "", done = null, errCode = null;
    const line = raw => {
      raw = raw.trim(); if (!raw) return;
      let m; try{ m = JSON.parse(raw); }catch(e){ return; }
      if (typeof m.t === "string"){ text += m.t; if (opts.onText){ try{ opts.onText({text}); }catch(e){} } }
      else if (m.error) errCode = String(m.error);
      else if (m.done) done = m;
    };
    try{
      for (;;){
        const r = await reader.read();
        if (r.done) break;
        buf += dec.decode(r.value, {stream:true});
        let i;
        while ((i = buf.indexOf("\n")) >= 0){ line(buf.slice(0, i)); buf = buf.slice(i + 1); }
      }
      line(buf + dec.decode());
    }catch(e){
      const err = fail(e && e.name === "AbortError" ? "cancelled" : "unavailable"); err.text = text; throw err;
    }
    if (errCode || !done){ const err = fail(errCode || "unavailable"); err.text = text; throw err; }
    if (!text.trim()) throw fail("empty_completion");
    return {text, truncated:!!done.truncated};
  };
}

/* ---------- Plano Pro: o app só lê; quem grava a assinatura é o servidor ---------- */
function makeSubscription(sb, uid){
  return async function subscription(){
    try{
      const { data, error } = await sb.from("subscriptions").select("plan,status,current_period_end").eq("user_id", uid).maybeSingle();
      if (error) return {active:null};
      if (!data) return {active:false};
      const until = data.current_period_end;
      const active = (data.status === "active" || data.status === "canceled") && Date.parse(until) > Date.now();
      return {active, plan:data.plan, status:data.status, until};
    }catch(e){ return {active:null}; }
  };
}

/* ---------- capacidades para o app ---------- */
let capsPromise = null;
function ready(){
  if (!ENABLED || !hasSession()) return Promise.resolve(null);
  if (!capsPromise){
    capsPromise = (async () => {
      try{
        const sb = await client();
        const s = await session();
        if (!s || !s.user) return null;
        const uid = s.user.id;
        const db = makeDb(sb, uid), sample = makeSample(sb);
        const user = {id:async () => uid, isOwner:async () => false, email:s.user.email || ""};
        return {cloud:true, subscription:makeSubscription(sb, uid), use:async name => name === "db" ? db : name === "user" ? user : name === "sample" ? sample : null};
      }catch(e){ return null; }
    })();
  }
  return capsPromise;
}

window.fichaCloud = {
  enabled:ENABLED,
  hasSession,
  ready,
  async email(){ try{ const s = await session(); return (s && s.user && s.user.email) || ""; }catch(e){ return ""; } },
  async sendCode(email){
    const sb = await client();
    const { error } = await sb.auth.signInWithOtp({email, options:{shouldCreateUser:true}});
    if (error) throw error;
  },
  async verifyCode(email, code){
    const sb = await client();
    const { data, error } = await sb.auth.verifyOtp({email, token:code, type:"email"});
    if (error) throw error;
    return !!(data && data.session);
  },
  async signOut(){
    try{ const sb = await client(); await sb.auth.signOut({scope:"local"}); }catch(e){}
    try{ localStorage.removeItem(AUTH_KEY); }catch(e){}
  }
};
})();
