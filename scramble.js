/* ══════════════════════════════════════════════════════
   DECRYPT ENGINE — the site's house effect
   value → resolves & locks · null → scrambles forever
   sealed → resolves to SEALED + date

   Lifted out of archive.html so every page speaks the
   same language. Load it before any script that uses it.
══════════════════════════════════════════════════════ */
const GLYPHS='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&$?/\\<>*+=—:·';
const rnd=n=>Math.floor(Math.random()*n);

/* Pages with audio can raise this 0→1 and the glyphs will churn harder on
   the loud passages. Left at 0 it behaves exactly as the archive always has. */
const Scramble={energy:0};

class Decrypt{
  constructor(el,text,mode){this.el=el;this.mode=mode;this.text=text||'';this.frame=0;this.raf=null;this.done=false;this.running=false}
  start(){
    if(this.running||this.done)return;
    this.running=true;
    if(this.mode==='eternal'){this.eternal();return}
    this.queue=[];
    for(let i=0;i<this.text.length;i++)this.queue.push({to:this.text[i],start:rnd(18),end:rnd(34)+12});
    this.frame=0;this.tick();
  }
  tick(){
    let out='',done=0;
    const churn=.3+Scramble.energy*.5;
    for(const q of this.queue){
      if(this.frame>=q.end){done++;out+=q.to}
      else if(this.frame>=q.start){if(!q.ch||Math.random()<churn)q.ch=GLYPHS[rnd(GLYPHS.length)];out+=q.ch}
      else out+=' ';
    }
    this.el.textContent=out;
    if(done===this.queue.length){this.done=true;this.running=false;this.raf=null;if(this.ondone)this.ondone();return}
    this.frame++;this.raf=requestAnimationFrame(()=>this.tick());
  }
  eternal(){
    const n=Math.max(7,this.text.length||7);
    const loop=()=>{
      let out='';for(let i=0;i<n;i++)out+=GLYPHS[rnd(GLYPHS.length)];
      this.el.textContent=out;
      this.timer=setTimeout(()=>{this.raf=requestAnimationFrame(loop)},70);
    };loop();
  }
  stop(){if(this.raf)cancelAnimationFrame(this.raf);clearTimeout(this.timer);this.raf=null;this.running=false}
}

const liveDecrypts=new Set();
function decryptInto(el,value){
  let mode='resolve',text=value;
  if(value===null||value===undefined){mode='eternal';text='UNKNOWN';el.classList.add('is-unknown')}
  else if(typeof value==='object'&&value.sealed){text='SEALED · '+value.sealed;el.classList.add('is-sealed')}
  const d=new Decrypt(el,text,mode);liveDecrypts.add(d);return d;
}
function killDecrypts(){liveDecrypts.forEach(d=>d.stop());liveDecrypts.clear()}

/* Resolve a string into an element, once. Returns the Decrypt so callers can
   hang an ondone off it and chain the next line of a sequence. */
function scrambleTo(el,text,ondone){
  const d=new Decrypt(el,text,'resolve');
  /* drop itself from the live set once it lands, so a page that re-scrambles
     the same line all session doesn't accumulate dead entries */
  d.ondone=()=>{liveDecrypts.delete(d);if(ondone)ondone()};
  liveDecrypts.add(d);d.start();return d;
}
