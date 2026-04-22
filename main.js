document.addEventListener('DOMContentLoaded',()=>{
  // Custom cursor
  const cur=document.getElementById('cur'),ring=document.getElementById('cur-ring');
  if(cur&&ring){
    let mx=0,my=0,rx=0,ry=0;
    document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.transform=`translate(${mx}px,${my}px)`;});
    (function a(){rx+=(mx-rx)*.1;ry+=(my-ry)*.1;ring.style.transform=`translate(${rx}px,${ry}px)`;requestAnimationFrame(a)})();
    document.querySelectorAll('a,button').forEach(el=>{
      el.addEventListener('mouseenter',()=>{cur.style.transform+=' scale(2.8)';ring.style.opacity='.15';});
      el.addEventListener('mouseleave',()=>{ring.style.opacity='.55';});
    });
  }
  // Nav shadow on scroll
  const nav=document.getElementById('nav');
  if(nav)window.addEventListener('scroll',()=>{nav.style.boxShadow=scrollY>20?'0 4px 40px rgba(0,0,0,.55)':'none';},{passive:true});
  // Scroll reveal
  const obs=new IntersectionObserver(entries=>entries.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');obs.unobserve(x.target);}}),{threshold:.1,rootMargin:'0px 0px -30px 0px'});
  document.querySelectorAll('.rv').forEach(el=>obs.observe(el));
});
