// Optional first-party analytics. Player controls never depend on telemetry.
(() => {
  try {
    const allowed = () => localStorage.getItem('rea.analytics.consent') === 'yes' &&
      !navigator.globalPrivacyControl && navigator.doNotTrack !== '1';
    const consent = document.createElement('button');
    consent.type = 'button';
    consent.style.cssText = 'margin:10px;padding:8px 12px;border-radius:5px;border:1px solid currentColor;background:transparent;color:inherit;cursor:pointer';
    const mount = () => {
      const host = document.querySelector('.sidebar-footer') || document.querySelector('aside') || document.body;
      host.append(consent);
      consent.textContent = 'Usage analytics · ' + (allowed() ? 'On' : 'Off');
    };
    document.addEventListener('DOMContentLoaded', mount);
    const id = () => crypto.randomUUID();
    let visitor, session = sessionStorage.getItem('rea.analytics.session'), tab = id(), playback, track, audio, position, sampled, moving = false;
    let queue = [], busy = false, attempts = 0, sequence = 0;
    function identity() {
      visitor = localStorage.getItem('rea.analytics.id') || id();
      localStorage.setItem('rea.analytics.id', visitor);
      if (!session || Date.now() - Number(sessionStorage.getItem('rea.analytics.last')) > 1800000) {
        session = id(); sessionStorage.setItem('rea.analytics.session',session);
      }
      sessionStorage.setItem('rea.analytics.last', Date.now());
    }
    function emit(type, seconds = 0, extra = {}) {
      try { if (!allowed() || document.hidden && !moving && ['api_latency','lcp','cls','inp','page_load','presence'].includes(type)) { if (!allowed()) queue = []; return; }
      identity();
      const now = Date.now();
      queue.push({id:id(),visitor,session,tab,seq:++sequence,type,at:now,seconds,
        playing:moving,track:track?.id || '',title:String(track?.title || '').slice(0,160),
        art:/^https:\/\/c\.saavncdn\.com\/[\w./%-]+$/.test(track?.cover) ? track.cover.slice(0,500) : '',artist:String(track?.artist || '').slice(0,160),playback:playback || null,...extra});
      if (queue.length > 48) queue.shift();
      void flush();
      } catch { queue=[]; }
    }
    async function flush() {
      if (busy || !navigator.onLine || !allowed()) return;
      queue = queue.filter(e => Date.now() - e.at < 45000);
      if (!queue.length) return;
      busy = true;
      const batch = queue.slice(0,12);
      try {
        const res = await fetch('/api/analytics/collect',{method:'POST',keepalive:true,
          headers:{'Content-Type':'application/json'},body:JSON.stringify(batch)});
        if (!res.ok && (res.status >= 500 || res.status === 429)) throw Error();
        queue = queue.filter(e => !batch.includes(e)); attempts = 0;
      } catch { if (++attempts >= 4) { queue = queue.filter(e => !batch.includes(e)); attempts = 0; } }
      finally { busy = false; if(queue.length) setTimeout(flush,1000 * 2 ** attempts); }
    }
    function sample() {
      const now = performance.now(), current = audio?.currentTime || 0;
      const delta = moving ? Math.max(0,Math.min(30,(now-sampled)/1000,current-position)) : 0;
      sampled = now; position = current;
      return Number(delta.toFixed(3)) || 0;
    }
    function stop(type) { const delta = sample(); moving = false; emit(type,delta); }
    function pulse() {
      if (document.hidden && !moving) return;
      const delta = sample();
      emit(moving && delta > 0 ? 'listening_heartbeat' : 'presence',delta);
    }
    function visit() {
      let referral = 'Direct';
      if (document.referrer) { try { referral = new URL(document.referrer).origin === location.origin ? 'Internal' : 'External'; } catch {} }
      emit('visit',0,{referral});
    }
    consent.onclick = () => {
      if (navigator.globalPrivacyControl || navigator.doNotTrack === '1') { consent.textContent = 'Analytics off · browser privacy setting'; return; }
      const enable = !allowed();
      localStorage.setItem('rea.analytics.consent',enable ? 'yes':'no');
      if (enable) { sample(); visit(); } else { queue=[]; localStorage.removeItem('rea.analytics.id'); session=null; }
      mount();
    };
    function measure(type,value){if (Number.isFinite(value)) emit(type,0,{value:Math.min(600000,Math.max(0,Math.round(value*1000)/1000))});}
    if (window.PerformanceObserver && Array.isArray(PerformanceObserver.supportedEntryTypes)) {
      for (const [name,type,metric] of [['largest-contentful-paint','lcp','startTime'],['layout-shift','cls','value'],['event','inp','duration']]) {
        if (!PerformanceObserver.supportedEntryTypes.includes(name)) continue;
        let last=0;
        new PerformanceObserver(list=>{for(const e of list.getEntries()){
          if(type==='cls'&&!e.hadRecentInput) last+=e.value;
          if(type==='lcp')last=e.startTime;
          if(type==='inp'&&e.interactionId)last=Math.max(last,e.duration);
        } if(last>0)measure(type,last);}).observe({type:name,buffered:true});
      }
    }
    addEventListener('load',()=>setTimeout(()=>measure('page_load',performance.getEntriesByType('navigation')[0]?.loadEventEnd),0));
    window.reaAnalytics = {
      async fetch(input, options) {
        const start=performance.now();
        try {const response=await fetch(input,options);if(!response.ok)emit('api_error');return response;}
        catch(error){emit('api_error');throw error;}
        finally {measure('api_latency',performance.now()-start);}
      },
      event:emit,
      select(next) {
        if (track && track.id !== next.id && playback) { stop('track_skip'); playback=null; }
        track=next; emit('track_selected');
      },
      attach(element) {
        audio=element;
        audio.addEventListener('playing',() => {
          if (moving) return;
          sample(); moving=true;
          const type=playback ? 'track_resume':'track_start';
          playback ||= id(); emit(type);
        });
        for (const name of ['waiting','pause','error','ended','seeking']) audio.addEventListener(name,() => {
          if (name === 'ended') { stop('track_end'); playback=null; }
          else if (name === 'error') stop('playback_error');
          else if (name === 'seeking') { position=audio.currentTime; stop('track_seek'); }
          else if (moving) stop('track_pause');
        });
        audio.addEventListener('seeked',()=>{ if (!audio.paused && !audio.ended && !moving) audio.dispatchEvent(new Event('playing')); });
      }
    };
    addEventListener('error',()=>emit('client_error'));
    addEventListener('online',pulse);
    document.addEventListener('visibilitychange',()=>{if(document.hidden && !moving)emit('leave');else pulse();});
    addEventListener('pagehide',()=>{
      if (!allowed()) return;
      stop('leave');
      if(queue.length) navigator.sendBeacon?.('/api/analytics/collect',new Blob([JSON.stringify(queue.slice(-12))],{type:'application/json'}));
    });
    setInterval(pulse,25000);
    visit();
  } catch { /* Unsupported storage or media environment. */ }
})();
