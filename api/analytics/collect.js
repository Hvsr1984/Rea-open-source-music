import {createHmac} from 'node:crypto';
const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
const types = new Set('visit presence leave track_selected track_start track_resume track_pause track_skip track_end track_seek listening_heartbeat playback_error search client_error api_error api_latency page_load lcp cls inp'.split(' '));
export function valid(e, now = Date.now()) {
  return e && Object.keys(e).every(k=>'id visitor session tab seq at type seconds playing track title artist playback referral value art'.split(' ').includes(k)) &&
    [e.id,e.visitor,e.session,e.tab].every(v=>typeof v === 'string' && uuid.test(v)) &&
    (e.playback === null || uuid.test(e.playback)) && Number.isSafeInteger(e.seq) && e.seq > 0 &&
    Number.isSafeInteger(e.at) && Math.abs(now-e.at)<60000 && types.has(e.type) &&
    Number.isFinite(e.seconds) && e.seconds>=0 && e.seconds<=30 && typeof e.playing==='boolean' &&
    [e.track,e.title,e.artist].every(v=>typeof v==='string' && v.length<=160) &&
    (!('art' in e) || typeof e.art==='string' && (e.art==='' || e.art.length<=500 && /^https:\/\/c\.saavncdn\.com\/[\w./%-]+$/.test(e.art))) &&
    (!('referral' in e) || ['Direct','External','Internal'].includes(e.referral)) &&
    (!('value' in e) || Number.isFinite(e.value) && e.value>=0 && e.value<=600000);
}
export default async function collect(req,res) {
  const end = code => { res.writeHead(code,{'Cache-Control':'no-store'}); res.end(); };
  if(req.method!=='POST') return end(405);
  if(!process.env.PLAYER_ORIGIN || req.headers.origin!==process.env.PLAYER_ORIGIN) return end(403);
  if(!req.headers['content-type']?.startsWith('application/json')) return end(415);
  try {
    let body=req.body;
    if(body===undefined) {
      const chunks=[]; let bytes=0;
      for await(const chunk of req) { bytes+=chunk.length; if(bytes>16384) return end(413); chunks.push(chunk); }
      body=Buffer.concat(chunks).toString();
    }
    if(Buffer.byteLength(typeof body==='string'?body:JSON.stringify(body))>16384) return end(413);
    let events;
    try {events=typeof body==='string'?JSON.parse(body):body;} catch {return end(400);}
    if(!Array.isArray(events)||!events.length||events.length>12||!events.every(e=>valid(e))) return end(400);
    const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!key || !process.env.RATE_LIMIT_SECRET || !process.env.SUPABASE_URL) return end(503);
    const source=req.headers['x-vercel-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
    const bucket=createHmac('sha256',process.env.RATE_LIMIT_SECRET).update(new Date().toISOString().slice(0,10)+source).digest('hex');
    const ua=String(req.headers['user-agent']||'');
    const agent={device:/Mobile|Android/i.test(ua)?'Mobile':'Desktop',browser:/Edg\//.test(ua)?'Edge':/Firefox/.test(ua)?'Firefox':/Chrome/.test(ua)?'Chrome':/Safari/.test(ua)?'Safari':'Other',
      os:/Android/.test(ua)?'Android':/iPhone|iPad/.test(ua)?'iOS':/Windows/.test(ua)?'Windows':/Mac OS/.test(ua)?'macOS':/Linux/.test(ua)?'Linux':'Other',
      country:/^[A-Z]{2}$/.test(req.headers['x-vercel-ip-country'])?req.headers['x-vercel-ip-country']:null};
    const response=await fetch(process.env.SUPABASE_URL+'/rest/v1/rpc/rea_collect',{method:'POST',headers:{apikey:key,Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify({events,bucket,agent}),signal:AbortSignal.timeout(7000)});
    if(!response.ok) return end(503);
    return end(await response.json() ? 204 : 429);
  } catch {return end(503);}
}
