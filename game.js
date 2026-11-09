'use strict';
const $=i=>document.getElementById(i),cv=$('c'),cx=cv.getContext('2d'),W=480,H=270;cv.width=W;cv.height=H;
const IM={};for(const[n,e]of Object.entries({e1:'png',e2:'png',e3:'png',e4:'png',pc:'webp',pl:'png',ca:'png'})){IM[n]=new Image;IM[n].src=`assets/${n}.${e}`}
const SZ=[[15,15],[23,23],[33,33]],PRE='hr-dark-',zb=new Float32Array(W);
let mob=0,peer,gp,conns=[],hc=null,isH=1,myId='H',G=null,M=[],AC,keys={},E=0,mv={x:0,y:0},look={dx:0},tch={};
const P={H:{x:1.5,y:1.5,a:0,d:0,l:0}};
const S=n=>{for(let i=0;i<4;i++)$('s'+i).hidden=i!=n},bc=d=>conns.forEach(c=>c.open&&c.send(d));
function msg(t,ms=2500){$('msg').textContent=t;setTimeout(()=>$('msg').textContent='',ms)}
// ---------- audio ----------
function au(){if(AC)return;AC=new(window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain(),l=AC.createOscillator(),lg=AC.createGain();o.type='sawtooth';o.frequency.value=38;g.gain.value=.05;l.frequency.value=.15;lg.gain.value=.03;l.connect(lg).connect(g.gain);o.connect(g).connect(AC.destination);o.start();l.start()}
const tn=(f,d,v,ty='sine',f2)=>{if(!AC)return;const t=AC.currentTime,o=AC.createOscillator(),g=AC.createGain();o.type=ty;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(Math.max(v,.002),t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g).connect(AC.destination);o.start(t);o.stop(t+d)};
const scare=()=>{tn(900,1.6,.5,'sawtooth',60);tn(1300,1.2,.4,'square',90);tn(50,1.6,.7)};
// ---------- map ----------
function rng(s){return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function gen(sd,sz,lv){const[w,h]=SZ[sz],r=rng(sd),m=Array.from({length:h},()=>Array(w).fill(1)),st=[[1,1]];m[1][1]=0;
 while(st.length){const[x,y]=st[st.length-1],d=[[2,0],[-2,0],[0,2],[0,-2]].filter(([a,b])=>m[y+b]&&m[y+b][x+a]===1);if(!d.length){st.pop();continue}const[a,b]=d[r()*d.length|0];m[y+b/2][x+a/2]=0;m[y+b][x+a]=0;st.push([x+a,y+b])}
 for(let i=0;i<w*h/14;i++)m[1+(r()*(h-2)|0)][1+(r()*(w-2)|0)]=0;
 const c=[],n=Math.min(2+lv,10),q=()=>3+((r()*((w-5)/2))|0)*2;
 for(let i=0;i<600&&c.length<n;i++){const x=q(),y=Math.min(q(),h-4);if(x+y<9||c.some(k=>Math.abs(k[0]-x-.5)+Math.abs(k[1]-y-.5)<6))continue;c.push([x+.5,y+.5]);for(let a=-1;a<2;a++)for(let b=-1;b<2;b++)m[y+b][x+a]=0}
 return{m,w,h,c}}
const free=(x,y)=>M[y|0]&&M[y|0][x|0]===0,blk=(x,y)=>!(free(x-.2,y-.2)&&free(x+.2,y-.2)&&free(x-.2,y+.2)&&free(x+.2,y+.2));
function cast(px,py,dx,dy){dx=dx||1e-9;dy=dy||1e-9;let mx=px|0,my=py|0,ax=Math.abs(1/dx),ay=Math.abs(1/dy),sx,sy,qx,qy,side=0;
 if(dx<0){sx=-1;qx=(px-mx)*ax}else{sx=1;qx=(mx+1-px)*ax}if(dy<0){sy=-1;qy=(py-my)*ay}else{sy=1;qy=(my+1-py)*ay}
 for(let i=0;i<80;i++){if(qx<qy){qx+=ax;mx+=sx;side=0}else{qy+=ay;my+=sy;side=1}if(!M[my]||M[my][mx]!==0)break}
 return[side?qy-ay:qx-ax,side]}
// ---------- network ----------
function mkHost(){const c=[...Array(5)].map(()=>'ABCDEFGHJKLMNPQRSTUVWXYZ'[Math.random()*24|0]).join('');peer=new Peer(PRE+c);
 peer.on('open',()=>$('code').textContent=c);peer.on('error',e=>e.type=='unavailable-id'?mkHost():$('st').textContent='مشكلة اتصال بالإنترنت');
 peer.on('connection',k=>{k.on('open',()=>{conns.push(k);P[k.peer]={x:1.5,y:1.5,a:0,d:0,l:0};lob()});
  k.on('data',d=>{const p=P[k.peer];if(d.t=='s'&&p){p.x=d.x;p.y=d.y;p.a=d.a;p.l=d.l}else if(d.t=='c'&&G)G.done[d.i]=1});
  k.on('close',()=>{conns=conns.filter(c=>c!=k);delete P[k.peer];lob()})})}
function lob(){const t='اللاعبون: '+(1+conns.length);$('pl').textContent=t;bc({t:'lob',s:t})}
function join(){const c=$('ci').value.trim().toUpperCase();if(!c)return;$('st').textContent='جاري الاتصال...';gp=new Peer();
 gp.on('open',id=>{myId=id;hc=gp.connect(PRE+c,{reliable:true});hc.on('open',()=>{isH=0;$('hr').hidden=1;$('st').textContent='تم الاتصال ✔ بانتظار المضيف ليبدأ...'});
  hc.on('data',onG);hc.on('close',()=>$('st').textContent='انقطع الاتصال')});gp.on('error',()=>$('st').textContent='تعذر الاتصال بهذا الكود')}
function onG(d){if(d.t=='lob')$('pl').textContent=d.s;else if(d.t=='go')startGame(d);else if(d.t=='over')showOver();
 else if(d.t=='w'&&G){G.P={};for(const k in d.p){const v=d.p[k];G.P[k]={x:v[0],y:v[1],a:v[2],d:v[3]}}G.mon={x:d.m[0],y:d.m[1],mv:d.m[2]};d.c.split('').forEach((v,i)=>v=='1'&&(G.done[i]=1))}}
function hostStart(){if(!isH)return;const d={t:'go',seed:Math.random()*1e9|0,sz:+$('mp').value,lv:1};bc(d);startGame(d)}
const nxt=()=>{if(!G||G.over)return;const d={t:'go',seed:Math.random()*1e9|0,sz:G.sz,lv:G.lv+1};bc(d);startGame(d)};
function dev(m){mob=m;$('eb').style.display=m?'block':'none';S(2);mkHost()}
function showOver(){document.exitPointerLock&&document.exitPointerLock();const l=G?G.lv:1;G=null;document.body.className='';$('eb').style.display='none';$('ot').textContent='العيون وجدتكم... وصلتم للمرحلة '+l;S(3)}
function startGame(d){const g=gen(d.seed,d.sz,d.lv);M=g.m;
 G={...g,lv:d.lv,sz:d.sz,done:g.c.map(()=>0),me:{x:1.5,y:1.5,a:g.m[1][2]===0?0:1.57,l:0},dead:0,load:0,t:0,ts:0,over:0,nx:0,sp:0,fs:0,bt:0,at:5,mon:{x:g.w-1.5,y:g.h-1.5,mv:0},P:isH?P:{}};
 if(isH)for(const k in P)Object.assign(P[k],{x:1.5,y:1.5,d:0,l:0});
 S(-1);document.body.className='g';msg('المرحلة '+d.lv,3000)}
// ---------- loop ----------
let last=performance.now();
function loop(t){requestAnimationFrame(loop);const dt=Math.min(.05,(t-last)/1e3);last=t;if(!G)return;upd(dt);if(G)draw(t/1e3)}
function upd(dt){const g=G,me=g.me,mo=g.mon;me.a+=look.dx*.006;look.dx=0;
 const L=Math.cos(me.a),Sn=Math.sin(me.a);
 if(isH){P.H.x=me.x;P.H.y=me.y;P.H.a=me.a;P.H.l=me.l;if(P.H.d&&!g.dead)die()}else{const p=g.P[myId];if(p&&p.d&&!g.dead)die()}
 if(!g.dead){let ni=-1,nd=1.5;g.c.forEach((c,i)=>{if(g.done[i])return;const rx=c[0]-me.x,ry=c[1]-me.y,d=Math.hypot(rx,ry);if(d<nd&&(rx*L+ry*Sn)/d>.55){nd=d;ni=i}});g.ni=ni;
  if(ni>=0&&E){g.load+=dt/3;if((g.bt-=dt)<0){g.bt=.5;tn(300,.1,.05,'square')}if(g.load>=1){g.load=0;g.done[ni]=1;if(!isH)hc.send({t:'c',i:ni});tn(880,.3,.2);tn(1320,.4,.2)}}
  else{g.load=0;let fw=(keys.KeyW||keys.ArrowUp?1:0)-(keys.KeyS||keys.ArrowDown?1:0),st=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0);if(mob){fw=-mv.y;st=mv.x}
   const l=Math.hypot(fw,st);if(l>1){fw/=l;st/=l}const sp=2.5*dt,vx=(L*fw-Sn*st)*sp,vy=(Sn*fw+L*st)*sp;if(!blk(me.x+vx,me.y))me.x+=vx;if(!blk(me.x,me.y+vy))me.y+=vy}
  const rx=mo.x-me.x,ry=mo.y-me.y,md=Math.hypot(rx,ry);me.l=0;if(md<12&&(rx*L+ry*Sn)/md>.62)me.l=cast(me.x,me.y,rx/md,ry/md)[0]>md-.3?1:0}
 else me.l=0;
 g.ts+=dt;const send=g.ts>.066;if(send)g.ts=0;
 if(isH){sim(dt);if(send&&G)bc({t:'w',p:Object.fromEntries(Object.keys(P).map(k=>[k,[+P[k].x.toFixed(2),+P[k].y.toFixed(2),+P[k].a.toFixed(2),P[k].d]])),m:[+mo.x.toFixed(2),+mo.y.toFixed(2),mo.mv],c:g.done.join('')})}
 else if(send&&!g.dead)hc.send({t:'s',x:me.x,y:me.y,a:me.a,l:me.l});
 if(!G)return;
 const cd=Math.hypot(mo.x-me.x,mo.y-me.y);if(mo.mv&&(g.fs-=dt)<0){g.fs=.55;tn(70,.3,Math.max(0,1-cd/18)*.7,'square',35)}
 if((g.at-=dt)<0){g.at=6+Math.random()*12;Math.random()<.6?tn(200+Math.random()*200,.9,.06,'sawtooth',90):tn(2000,.7,.02,'triangle',1400)}
 g.vg=Math.max(0,1-cd/6)}
function die(){G.dead=1;scare();msg('أمسك بك! أنت الآن تشاهد صديقك',4000)}
const bfs=(tx,ty)=>{const D=Array.from({length:G.h},()=>Array(G.w).fill(1e9));D[ty][tx]=0;const q=[[tx,ty]];for(let i=0;i<q.length;i++){const[x,y]=q[i];for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const X=x+a,Y=y+b;if(M[Y]&&M[Y][X]===0&&D[Y][X]>D[y][x]+1){D[Y][X]=D[y][x]+1;q.push([X,Y])}}}return D};
function sim(dt){const g=G,mo=g.mon;if(g.over)return;g.t+=dt;const al=Object.keys(P).filter(k=>!P[k].d);
 if(!al.length){g.over=1;bc({t:'over'});setTimeout(showOver,1800);return}
 if(g.done.every(x=>x)&&!g.nx){g.nx=1;msg('اكتملت الحواسيب... انتظروا',2400);setTimeout(nxt,2500)}
 mo.mv=0;if(g.t<7)return;
 if(!al.some(k=>P[k].l)){let b=al[0],bd=1e9;for(const k of al){const d=Math.hypot(P[k].x-mo.x,P[k].y-mo.y);if(d<bd){bd=d;b=k}}
  const T=P[b],mx=mo.x|0,my=mo.y|0,D=bfs(T.x|0,T.y|0);let bn=[mx,my],bv=D[my]?D[my][mx]:1e9;
  for(const[a,c]of[[1,0],[-1,0],[0,1],[0,-1]]){const v=D[my+c]&&D[my+c][mx+a];if(v<bv){bv=v;bn=[mx+a,my+c]}}
  const same=bn[0]==mx&&bn[1]==my,tx=same?T.x:bn[0]+.5,ty=same?T.y:bn[1]+.5,dx=tx-mo.x,dy=ty-mo.y,l=Math.hypot(dx,dy)||1,sp=Math.min(1+.2*g.lv,2.3)*dt;
  mo.x+=dx/l*Math.min(sp,l);mo.y+=dy/l*Math.min(sp,l);mo.mv=1}
 for(const k of al)if(Math.hypot(P[k].x-mo.x,P[k].y-mo.y)<.65)P[k].d=1}
// ---------- render ----------
const lt=(x,y,L)=>{let b=0;for(const l of L)b=Math.max(b,Math.pow(Math.max(0,1-Math.hypot(x-l[0],y-l[1])/l[2]),1.6));return b};
function draw(t){const g=G;let cam=g.me;
 if(g.dead){const al=Object.keys(g.P).filter(k=>k!=myId&&!g.P[k].d);if(al.length)cam=g.P[al[g.sp%al.length]]}
 const fl=.92+.08*Math.sin(t*9)+Math.random()*.05,cid=cam===g.me?myId:null,oth=Object.entries(g.P).filter(([k,p])=>p!==cam&&!(isH?false:k==myId)&&k!==(isH&&cam===g.me?'H':'')&&!(g.dead&&k==(isH?'H':myId)));
 const px=cam.x,py=cam.y,dx=Math.cos(cam.a),dy=Math.sin(cam.a),plx=-dy*.66,ply=dx*.66;
 const L=[[px,py,6.5*fl]];for(const[k,p]of oth)L.push([p.x-Math.cos(p.a)*.3,p.y-Math.sin(p.a)*.3,4.5*fl]);
 cx.fillStyle='#000';cx.fillRect(0,0,W,H);
 for(let y=H/2+1|0;y<H;y++){const rd=.5*H/(y-H/2),b=Math.pow(Math.max(0,1-rd/(6.5*fl)),1.6);cx.fillStyle=`rgb(${b*55|0},${b*42|0},${b*32|0})`;cx.fillRect(0,y,W,1)}
 for(let i=0;i<W;i++){const cxm=2*i/W-1,rx=dx+plx*cxm,ry=dy+ply*cxm,[d,s]=cast(px,py,rx,ry);zb[i]=d;const hx=px+rx*d,hy=py+ry*d,wx=s?hx%1:hy%1,b=.02+.98*lt(hx,hy,L),v=(.82+.18*((wx*12|0)%2))*b*(s?.7:1),lh=H/d;
  cx.fillStyle=`rgb(${125*v|0},${105*v|0},${75*v|0})`;cx.fillRect(i,(H-lh)/2,1,lh)}
 const it=[],mo=g.mon,md=Math.hypot(mo.x-px,mo.y-py);
 g.c.forEach((c,i)=>it.push({x:c[0],y:c[1],im:IM.pc,sh:.5,lf:0,al:g.done[i]?.35:.95}));
 for(const[k,p]of oth)if(!p.d){it.push({x:p.x,y:p.y,im:IM.pl,sh:.85,lf:0,al:Math.max(.5,lt(p.x,p.y,L))});it.push({x:p.x-Math.cos(p.a)*.35,y:p.y-Math.sin(p.a)*.35,im:IM.ca,sh:.28,lf:.35,al:1})}
 it.push({x:mo.x,y:mo.y,im:md<3?IM.e1:md<5.5?IM.e2:md<9?IM.e3:IM.e4,sh:1.05,lf:0,al:Math.max(.3,lt(mo.x,mo.y,L))});
 it.forEach(o=>{o.ty=0;const rx=o.x-px,ry=o.y-py,iv=1/(plx*dy-dx*ply),tx=iv*(dy*rx-dx*ry);o.ty=iv*(-ply*rx+plx*ry);o.tx=tx}); it.sort((a,b)=>b.ty-a.ty);
 for(const o of it){if(o.ty<.15||!o.im.naturalWidth)continue;const sc=H/o.ty,h=sc*o.sh,w=h*o.im.naturalWidth/o.im.naturalHeight,sx=W/2*(1+o.tx/o.ty),top=H/2+sc*.5-sc*o.lf-h,iw=o.im.naturalWidth,ih=o.im.naturalHeight;cx.globalAlpha=o.al;
  for(let x=Math.max(0,sx-w/2|0);x<Math.min(W,sx+w/2);x+=2){if(o.ty>=zb[x])continue;cx.drawImage(o.im,(x-(sx-w/2))/w*iw,0,Math.max(1,2/w*iw),ih,x,top,2,h)}cx.globalAlpha=1}
 const dn=g.done.filter(x=>x).length;$('hud').innerHTML=`المرحلة ${g.lv}<br>الحواسيب: ${dn}/${g.done.length}<br>${g.dead?'تشاهد صديقك (اضغط للتبديل)':g.ni>=0?'اضغط E وانتظر':''}`;
 $('bar').style.display=g.load>0?'block':'none';$('bi').style.width=g.load*100+'%';$('candle').style.transform=`scale(${.95+.08*Math.sin(t*9)})`;
 $('vg').style.boxShadow=`inset 0 0 120px rgba(200,0,0,${g.vg*.7})`}
// ---------- input ----------
addEventListener('keydown',e=>{keys[e.code]=1;if(e.code=='KeyE')E=1;if(e.code=='Space'&&G)G.sp++});addEventListener('keyup',e=>{keys[e.code]=0;if(e.code=='KeyE')E=0});
cv.onclick=()=>{if(!mob&&cv.requestPointerLock)cv.requestPointerLock();if(G&&G.dead)G.sp++};
addEventListener('mousemove',e=>{if(document.pointerLockElement===cv)look.dx+=e.movementX*.4});
const cl=v=>Math.max(-1,Math.min(1,v));
cv.addEventListener('touchstart',e=>{for(const t of e.changedTouches)tch[t.identifier]={sx:t.clientX,sy:t.clientY,px:t.clientX,m:t.clientX<innerWidth/2};if(G&&G.dead)G.sp++;e.preventDefault()},{passive:false});
cv.addEventListener('touchmove',e=>{for(const t of e.changedTouches){const o=tch[t.identifier];if(!o)continue;if(o.m){mv.x=cl((t.clientX-o.sx)/50);mv.y=cl((t.clientY-o.sy)/50)}else{look.dx+=(t.clientX-o.px);o.px=t.clientX}}e.preventDefault()},{passive:false});
const te=e=>{for(const t of e.changedTouches){const o=tch[t.identifier];if(o&&o.m)mv={x:0,y:0};delete tch[t.identifier]}};cv.addEventListener('touchend',te);cv.addEventListener('touchcancel',te);
$('eb').addEventListener('touchstart',e=>{E=1;e.preventDefault()});$('eb').addEventListener('touchend',()=>E=0);
requestAnimationFrame(loop);
