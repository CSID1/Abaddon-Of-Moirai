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

  /* Ambient cursor light. Cosmetic only; disabled for reduced-motion users. */
  const reduced=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!reduced && window.matchMedia('(pointer:fine)').matches){
    let raf=0;
    window.addEventListener('pointermove',e=>{
      if(raf) return;
      raf=requestAnimationFrame(()=>{
        const x=(e.clientX/window.innerWidth)*100;
        const y=(e.clientY/window.innerHeight)*100;
        document.documentElement.style.setProperty('--mx',x.toFixed(2)+'%');
        document.documentElement.style.setProperty('--my',y.toFixed(2)+'%');
        raf=0;
      });
    },{passive:true});
  }
})();
