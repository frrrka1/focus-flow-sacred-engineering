const canvas=document.getElementById('field-canvas');
const ctx=canvas.getContext('2d');
let w,h,particles=[];
function resize(){w=canvas.width=innerWidth*devicePixelRatio;h=canvas.height=innerHeight*devicePixelRatio;canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';particles=Array.from({length:90},()=>({x:Math.random()*w,y:Math.random()*h,a:Math.random()*Math.PI*2,r:20+Math.random()*80,s:.15+Math.random()*.45}));}
function draw(t){ctx.clearRect(0,0,w,h);ctx.lineWidth=devicePixelRatio;for(const p of particles){p.a+=0.002*p.s;const x=p.x+Math.cos(p.a)*p.r;const y=p.y+Math.sin(p.a)*p.r;ctx.beginPath();ctx.arc(x,y,1.3*devicePixelRatio,0,Math.PI*2);ctx.fillStyle='rgba(30,30,28,.18)';ctx.fill();}
for(let i=0;i<particles.length;i+=3){const p=particles[i],q=particles[(i+11)%particles.length];ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle='rgba(35,35,32,.035)';ctx.stroke();}requestAnimationFrame(draw)}
resize(); addEventListener('resize',resize); requestAnimationFrame(draw);
const field=document.querySelector('.cursor-field'); addEventListener('pointermove',e=>{field.style.transform=`translate(${e.clientX-37}px,${e.clientY-37}px)`});
document.querySelector('[data-breath-toggle]').addEventListener('click',()=>document.body.classList.toggle('still'));

const menuBtn=document.querySelector('[data-menu]');
const menuPanel=document.querySelector('[data-menu-panel]');
if(menuBtn&&menuPanel){
  menuBtn.addEventListener('click',()=>menuPanel.classList.toggle('open'));
  menuPanel.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menuPanel.classList.remove('open')));
}
