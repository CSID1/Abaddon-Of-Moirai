(function(){
  const tabs=[...document.querySelectorAll('.tab[data-view]')];
  const views=[...document.querySelectorAll('.view')];

  function select(view){
    tabs.forEach(b=>b.classList.toggle('active',b.dataset.view===view));
    views.forEach(v=>v.classList.toggle('active',v.id===view));
  }

  tabs.forEach(b=>b.addEventListener('click',()=>select(b.dataset.view)));

  document.querySelectorAll('[data-copy-target]').forEach(btn=>{
    btn.addEventListener('click', async()=>{
      const el=document.getElementById(btn.dataset.copyTarget);
      if(!el) return;
      const original=btn.textContent;
      try {
        await navigator.clipboard.writeText(el.textContent);
        btn.textContent='Copied';
      } catch(e) {
        btn.textContent='Copy failed';
      }
      setTimeout(()=>btn.textContent=original||'Copy source',1200);
    });
  });

  document.querySelectorAll('[data-download-target]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const el=document.getElementById(btn.dataset.downloadTarget);
      if(!el) return;
      const blob=new Blob([el.textContent],{type:btn.dataset.mime||'text/plain;charset=utf-8'});
      const url=URL.createObjectURL(blob);
      const a=document.createElement('a');
      a.href=url;
      a.download=btn.dataset.filename||'source.txt';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(()=>URL.revokeObjectURL(url),1000);
    });
  });

  document.querySelectorAll('[data-card-search]').forEach(search=>{
    const scope=search.closest('.section-body') || document;
    search.addEventListener('input',()=>{
      const q=search.value.toLowerCase();
      scope.querySelectorAll('[data-search-card]').forEach(c=>{
        c.style.display=c.textContent.toLowerCase().includes(q)?'block':'none';
      });
    });
  });

  /* Ambient cursor light. Smoothly follows pointer position on desktop. */
  const reduced=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer=window.matchMedia && window.matchMedia('(pointer:fine)').matches;

  if(!reduced && finePointer){
    let targetX=50, targetY=24;
    let currentX=50, currentY=24;
    let running=false;

    const renderGlow=()=>{
      currentX += (targetX-currentX)*0.16;
      currentY += (targetY-currentY)*0.16;

      document.documentElement.style.setProperty('--mx',currentX.toFixed(2)+'%');
      document.documentElement.style.setProperty('--my',currentY.toFixed(2)+'%');

      const stillMoving=Math.abs(targetX-currentX)>.02 || Math.abs(targetY-currentY)>.02;
      if(stillMoving){
        requestAnimationFrame(renderGlow);
      } else {
        running=false;
      }
    };

    window.addEventListener('pointermove',e=>{
      targetX=(e.clientX/window.innerWidth)*100;
      targetY=(e.clientY/window.innerHeight)*100;
      document.documentElement.style.setProperty('--cursor-opacity','1');
      if(!running){
        running=true;
        requestAnimationFrame(renderGlow);
      }
    },{passive:true});

    window.addEventListener('pointerleave',()=>{
      document.documentElement.style.setProperty('--cursor-opacity','.45');
    });

    window.addEventListener('pointerenter',()=>{
      document.documentElement.style.setProperty('--cursor-opacity','1');
    });
  }
})();
