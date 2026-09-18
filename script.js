document.addEventListener('DOMContentLoaded', () => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const clock = document.querySelector('#system-time');
  const tick = () => { const value = new Intl.DateTimeFormat('es-VE',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(new Date()); clock.textContent=value; clock.dateTime=value; };
  tick(); setInterval(tick,1000);
  document.querySelectorAll('.reveal').forEach(el => { el.style.setProperty('--delay',`${el.dataset.delay||0}ms`); requestAnimationFrame(()=>el.classList.add('visible')); });
  document.querySelectorAll('.ripple-target').forEach(button => button.addEventListener('click', event => {
    const rect=button.getBoundingClientRect(), size=Math.max(rect.width,rect.height), ripple=document.createElement('span');
    ripple.className='ripple'; Object.assign(ripple.style,{width:`${size}px`,height:`${size}px`,left:`${event.clientX-rect.left-size/2}px`,top:`${event.clientY-rect.top-size/2}px`});
    button.append(ripple); ripple.addEventListener('animationend',()=>ripple.remove());
  }));
  if(fine&&!reduced){
    const orb=document.querySelector('#cursor-orb'); addEventListener('pointermove',e=>{orb.style.left=`${e.clientX}px`;orb.style.top=`${e.clientY}px`;},{passive:true});
    document.querySelectorAll('.portal-card').forEach(card=>{ let cooled=true;
      card.addEventListener('pointermove',e=>{ const r=card.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top,px=x/r.width,py=y/r.height;
        card.style.setProperty('--mx',`${px*100}%`);card.style.setProperty('--my',`${py*100}%`);card.style.transform=`translateY(-7px) rotateX(${(0.5-py)*5}deg) rotateY(${(px-0.5)*6}deg)`;
        if(cooled&&Math.random()>.65){cooled=false;const p=document.createElement('i');p.className='particle';Object.assign(p.style,{left:`${x}px`,top:`${y}px`});p.style.setProperty('--tx',`${(Math.random()-.5)*54}px`);p.style.setProperty('--ty',`${(Math.random()-.5)*54}px`);card.querySelector('.card-particles').append(p);p.addEventListener('animationend',()=>p.remove());setTimeout(()=>cooled=true,80);}
      }); card.addEventListener('pointerleave',()=>{card.style.transform='';card.style.setProperty('--mx','50%');card.style.setProperty('--my','50%');});
    });
  }
  const canvas=document.querySelector('#data-canvas'),ctx=canvas.getContext('2d');let w,h,nodes=[],frame;
  class Node{constructor(){this.reset(true)} reset(initial=false){this.x=Math.random()*w;this.y=initial?Math.random()*h:h+20;this.vx=(Math.random()-.5)*.13;this.vy=-(Math.random()*.16+.05);this.r=Math.random()*1.2+.35;this.a=Math.random()*.45+.12;this.c=Math.random()>.42} update(){this.x+=this.vx;this.y+=this.vy;if(this.y< -20||this.x< -20||this.x>w+20)this.reset()} draw(){ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.fillStyle=this.c?`rgba(0,217,246,${this.a})`:`rgba(0,245,160,${this.a})`;ctx.fill()}}
  function resize(){const d=Math.min(devicePixelRatio||1,2);w=innerWidth;h=innerHeight;canvas.width=w*d;canvas.height=h*d;canvas.style.width=`${w}px`;canvas.style.height=`${h}px`;ctx.setTransform(d,0,0,d,0,0);nodes=Array.from({length:Math.min(95,Math.floor(w/14))},()=>new Node())}
  function draw(){ctx.clearRect(0,0,w,h);nodes.forEach((a,i)=>{a.update();a.draw();for(let j=i+1;j<nodes.length;j++){const b=nodes[j],dist=Math.hypot(a.x-b.x,a.y-b.y);if(dist<130){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=`rgba(35,196,210,${(1-dist/130)*.1})`;ctx.lineWidth=.5;ctx.stroke()}}});frame=requestAnimationFrame(draw)}
  resize(); reduced?nodes.forEach(n=>n.draw()):draw(); addEventListener('resize',resize,{passive:true}); document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(frame);else if(!reduced)draw()});
});
