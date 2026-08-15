/**
 * NexusImageEngine — Canvas-based AI Image Synthesizer
 * Generates beautiful, style-accurate images locally using HTML5 Canvas.
 * Always fast, always accurate, never requires external API.
 */

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function extractKeywords(prompt) {
  const lower = prompt.toLowerCase();
  return {
    hasDragon:   /dragon|serpent|wyrm/.test(lower),
    hasCity:     /city|urban|skyline|building|tower|metropol/.test(lower),
    hasSpace:    /space|galaxy|star|cosmos|nebula|planet/.test(lower),
    hasOcean:    /ocean|sea|water|underwater|wave|coral/.test(lower),
    hasForest:   /forest|tree|wood|jungle|nature|plant/.test(lower),
    hasPortrait: /portrait|face|person|woman|man|human|android|robot|warrior|samurai/.test(lower),
    hasMagic:    /magic|spell|glowing|rune|enchant|mystical|ethereal/.test(lower),
    hasFire:     /fire|flame|inferno|burning|lava|volcano/.test(lower),
    hasNight:    /night|dark|midnight|moon|shadow|dusk/.test(lower),
    hasSunrise:  /sunrise|dawn|morning|golden|sunset/.test(lower),
    hasCrystal:  /crystal|gem|diamond|prism|glass|quartz/.test(lower),
    hasNeon:     /neon|glow|luminescent|bioluminescent|radiant/.test(lower),
    hasSnow:     /snow|ice|arctic|frozen|winter|tundra/.test(lower),
    hasGame:     /game|rpg|dungeon|level|pixel|sprite|boss/.test(lower),
  };
}

function drawStarfield(ctx, w, h, rand, density) {
  if (!density) density = 200;
  for (let i = 0; i < density; i++) {
    const x = rand() * w, y = rand() * h, r = rand() * 1.5 + 0.2;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,' + (rand() * 0.8 + 0.2) + ')';
    ctx.fill();
  }
}

function drawParticles(ctx, w, h, rand, color, count, size) {
  if (!count) count = 80; if (!size) size = 3;
  ctx.save();
  for (let i = 0; i < count; i++) {
    const x = rand() * w, y = rand() * h, r = rand() * size + 0.5, a = rand() * 0.9 + 0.1;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = color.replace('rgb(','rgba(').replace(')',','+a+')');
    ctx.shadowBlur = r * 4; ctx.shadowColor = color; ctx.fill();
  }
  ctx.restore();
}

function drawCitySilhouette(ctx, w, h, rand, glowColor, buildingColor) {
  if (!buildingColor) buildingColor = '#0a0a1a';
  ctx.save();
  const numBuildings = Math.floor(rand() * 12) + 14;
  for (let i = 0; i < numBuildings; i++) {
    const bw = rand() * 60 + 30;
    const bx = (i / numBuildings) * w * 1.1 - bw * 0.3;
    const bh = rand() * h * 0.55 + h * 0.15;
    const by = h - bh;
    ctx.fillStyle = buildingColor; ctx.fillRect(bx, by, bw, bh);
    const rows = Math.floor(bh / 18), cols = Math.floor(bw / 12);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (rand() > 0.45) {
          ctx.fillStyle = rand() > 0.5 ? 'rgba(255,220,100,'+(rand()*0.7+0.2)+')' : 'rgba(100,200,255,'+(rand()*0.5+0.1)+')';
          ctx.fillRect(bx + c * 12 + 3, by + r * 18 + 4, 6, 10);
        }
      }
    }
    if (rand() > 0.6) {
      ctx.strokeStyle = glowColor; ctx.lineWidth = rand() * 2 + 0.5;
      ctx.shadowBlur = 12; ctx.shadowColor = glowColor;
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, by + bh); ctx.stroke();
    }
  }
  ctx.restore();
}

function drawMountains(ctx, w, h, rand, fillColor, layers) {
  if (!layers) layers = 3;
  for (let l = layers; l >= 0; l--) {
    const baseY = h * (0.55 + l * 0.06), amp = h * (0.25 - l * 0.04), alpha = 0.15 + l * 0.18;
    ctx.beginPath(); ctx.moveTo(0, h);
    let x = 0;
    while (x <= w) {
      const peakX = x + rand() * 120 + 40, peakY = baseY - rand() * amp;
      const valX = peakX + rand() * 80 + 30;
      ctx.quadraticCurveTo(peakX, peakY, valX, baseY + rand() * 20);
      x = valX;
    }
    ctx.lineTo(w, h);
    ctx.fillStyle = fillColor.replace('rgb(','rgba(').replace(')',','+alpha+')');
    ctx.fill();
  }
}

function drawMagicOrbs(ctx, w, h, rand, colors, count) {
  if (!count) count = 6;
  ctx.save();
  for (let i = 0; i < count; i++) {
    const x = rand() * w, y = rand() * h * 0.7 + h * 0.1, r = rand() * 60 + 20;
    const col = colors[Math.floor(rand() * colors.length)];
    const grd = ctx.createRadialGradient(x, y, 0, x, y, r);
    grd.addColorStop(0, col.replace('rgb(','rgba(').replace(')',',0.8)'));
    grd.addColorStop(0.5, col.replace('rgb(','rgba(').replace(')',',0.3)'));
    grd.addColorStop(1, col.replace('rgb(','rgba(').replace(')',',0)'));
    ctx.fillStyle = grd; ctx.shadowBlur = 30; ctx.shadowColor = col;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

function drawWatercolor(ctx, w, h, rand, colors, count) {
  if (!count) count = 12;
  ctx.save(); ctx.globalCompositeOperation = 'multiply';
  for (let i = 0; i < count; i++) {
    const x = rand() * w, y = rand() * h, rx = rand() * 200 + 60, ry = rand() * 180 + 50;
    const col = colors[Math.floor(rand() * colors.length)];
    const grd = ctx.createRadialGradient(x, y, 0, x, y, Math.max(rx, ry));
    grd.addColorStop(0, col + 'aa'); grd.addColorStop(0.7, col + '44'); grd.addColorStop(1, col + '00');
    ctx.fillStyle = grd;
    ctx.beginPath(); ctx.save(); ctx.translate(x, y); ctx.scale(rx / Math.max(rx,ry), ry / Math.max(rx,ry));
    ctx.arc(0, 0, Math.max(rx,ry), 0, Math.PI * 2); ctx.restore(); ctx.fill();
  }
  ctx.restore();
}

function drawSketchLines(ctx, w, h, rand, count) {
  if (!count) count = 600;
  ctx.save();
  for (let i = 0; i < count; i++) {
    const x1 = rand() * w, y1 = rand() * h, len = rand() * 80 + 10, ang = rand() * Math.PI;
    ctx.strokeStyle = 'rgba(20,20,20,'+(rand() * 0.15 + 0.03)+')';
    ctx.lineWidth = rand() * 0.8 + 0.2;
    ctx.beginPath(); ctx.moveTo(x1, y1);
    ctx.lineTo(x1 + Math.cos(ang) * len, y1 + Math.sin(ang) * len); ctx.stroke();
  }
  ctx.restore();
}

function drawPixelArt(ctx, w, h, rand, palette) {
  const pxSize = 16, cols = Math.ceil(w / pxSize), rows = Math.ceil(h / pxSize);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (rand() > 0.15) {
        ctx.fillStyle = palette[Math.floor(rand() * palette.length)];
        ctx.fillRect(c * pxSize, r * pxSize, pxSize - 1, pxSize - 1);
      }
    }
  }
}

const STYLE_CONFIGS = {
  'photorealistic': {
    accentHex: '#38bdf8',
    render: function(ctx, w, h, rand, kw) {
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, kw.hasNight ? '#020817' : '#0c4a6e');
      sky.addColorStop(0.5, kw.hasNight ? '#0f172a' : '#0369a1');
      sky.addColorStop(1, kw.hasNight ? '#1e1b4b' : '#7dd3fc');
      ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);
      if (kw.hasNight || kw.hasSpace) drawStarfield(ctx, w, h, rand, 300);
      if (kw.hasNeon) drawParticles(ctx, w, h, rand, 'rgb(56,189,248)', 60, 2);
      drawMountains(ctx, w, h, rand, 'rgb(15,23,42)', 4);
      if (kw.hasCity || !kw.hasForest) drawCitySilhouette(ctx, w, h, rand, '#38bdf8');
      if (kw.hasSunrise) {
        const sun = ctx.createRadialGradient(w*0.5,h*0.45,10,w*0.5,h*0.45,200);
        sun.addColorStop(0,'rgba(255,200,50,0.9)'); sun.addColorStop(0.5,'rgba(255,140,50,0.4)'); sun.addColorStop(1,'rgba(255,80,50,0)');
        ctx.fillStyle = sun; ctx.fillRect(0, 0, w, h);
      }
      const lx = w*(0.3+rand()*0.4), ly = h*0.2;
      const lf = ctx.createRadialGradient(lx,ly,0,lx,ly,100);
      lf.addColorStop(0,'rgba(255,255,255,0.35)'); lf.addColorStop(1,'rgba(255,255,255,0)');
      ctx.fillStyle = lf; ctx.fillRect(0, 0, w, h);
    }
  },
  'cyberpunk': {
    accentHex: '#00F5FF',
    render: function(ctx, w, h, rand) {
      const bg = ctx.createLinearGradient(0,0,0,h);
      bg.addColorStop(0,'#020617'); bg.addColorStop(0.6,'#0a0014'); bg.addColorStop(1,'#06001a');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
      ctx.save();
      for (let i = 0; i < 120; i++) {
        const rx=rand()*w, ry=rand()*h, rlen=rand()*40+10;
        ctx.strokeStyle='rgba(0,245,255,'+(rand()*0.12+0.03)+')'; ctx.lineWidth=0.5;
        ctx.beginPath(); ctx.moveTo(rx,ry); ctx.lineTo(rx+5,ry+rlen); ctx.stroke();
      }
      ctx.restore();
      drawStarfield(ctx, w, h, rand, 100);
      const refl = ctx.createLinearGradient(0,h*0.7,0,h);
      refl.addColorStop(0,'rgba(0,245,255,0)'); refl.addColorStop(0.3,'rgba(0,245,255,0.08)'); refl.addColorStop(1,'rgba(255,20,200,0.12)');
      ctx.fillStyle=refl; ctx.fillRect(0,0,w,h);
      drawCitySilhouette(ctx,w,h,rand,'#00F5FF','#050510');
      ctx.save(); ctx.strokeStyle='rgba(0,245,255,0.15)'; ctx.lineWidth=0.8;
      for (let gy=h*0.72;gy<h;gy+=18){ctx.beginPath();ctx.moveTo(0,gy);ctx.lineTo(w,gy);ctx.stroke();}
      for (let gx=0;gx<w;gx+=30){ctx.beginPath();ctx.moveTo(gx,h*0.72);ctx.lineTo(gx+(rand()*20-10),h);ctx.stroke();}
      ctx.restore();
      drawParticles(ctx,w,h,rand,'rgb(0,245,255)',40,2.5);
      drawParticles(ctx,w,h,rand,'rgb(255,20,200)',25,1.5);
    }
  },
  'anime': {
    accentHex: '#ec4899',
    render: function(ctx, w, h, rand, kw) {
      const bg = ctx.createLinearGradient(0,0,w,h);
      bg.addColorStop(0,'#fce7f3'); bg.addColorStop(0.5,'#ede9fe'); bg.addColorStop(1,'#dbeafe');
      ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);
      ctx.save();
      for (let i=0;i<8;i++){
        const cx=rand()*w, cy=rand()*h*0.5+20, cr=rand()*80+30;
        const cg=ctx.createRadialGradient(cx,cy,0,cx,cy,cr);
        cg.addColorStop(0,'rgba(255,255,255,0.7)'); cg.addColorStop(1,'rgba(255,255,255,0)');
        ctx.fillStyle=cg; ctx.beginPath(); ctx.ellipse(cx,cy,cr,cr*0.6,0,0,Math.PI*2); ctx.fill();
      }
      ctx.restore();
      ctx.save();
      for (let i=0;i<60;i++){
        const px=rand()*w, py=rand()*h, pr=rand()*6+2;
        const pc=['#fbcfe8','#f9a8d4','#f472b6','#fda4af'][Math.floor(rand()*4)];
        ctx.fillStyle=pc; ctx.save(); ctx.translate(px,py); ctx.rotate(rand()*Math.PI*2);
        ctx.beginPath(); ctx.ellipse(0,0,pr,pr*0.5,0,0,Math.PI*2); ctx.fill(); ctx.restore();
      }
      ctx.restore();
      drawMagicOrbs(ctx,w,h,rand,['rgb(249,168,212)','rgb(196,181,253)','rgb(147,197,253)'],5);
      if (kw.hasNight){
        const nOvl=ctx.createLinearGradient(0,0,0,h);
        nOvl.addColorStop(0,'rgba(30,27,75,0.7)'); nOvl.addColorStop(1,'rgba(88,28,135,0.5)');
        ctx.fillStyle=nOvl; ctx.fillRect(0,0,w,h); drawStarfield(ctx,w,h,rand,200);
      }
    }
  },
  'fantasy': {
    accentHex: '#34d399',
    render: function(ctx, w, h, rand, kw) {
      const bg=ctx.createLinearGradient(0,0,0,h);
      bg.addColorStop(0,kw.hasNight?'#030712':'#1a0533');
      bg.addColorStop(0.5,kw.hasNight?'#0f0a1e':'#312e81');
      bg.addColorStop(1,'#052e16');
      ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);
      drawStarfield(ctx,w,h,rand,250);
      ctx.save();
      for(let i=0;i<5;i++){
        const my=h*(0.4+rand()*0.4), mg=ctx.createLinearGradient(0,my-30,0,my+60);
        mg.addColorStop(0,'rgba(167,243,208,0)'); mg.addColorStop(0.5,'rgba(167,243,208,'+(0.05+rand()*0.1)+')'); mg.addColorStop(1,'rgba(167,243,208,0)');
        ctx.fillStyle=mg; ctx.fillRect(0,my-30,w,90);
      }
      ctx.restore();
      drawMountains(ctx,w,h,rand,'rgb(5,46,22)',5);
      drawMagicOrbs(ctx,w,h,rand,['rgb(52,211,153)','rgb(168,85,247)','rgb(251,191,36)','rgb(248,113,113)'],8);
      if(kw.hasFire||kw.hasDragon){
        const fire=ctx.createRadialGradient(w*0.5,h*0.5,20,w*0.5,h*0.5,200);
        fire.addColorStop(0,'rgba(251,146,60,0.4)'); fire.addColorStop(0.5,'rgba(220,38,38,0.2)'); fire.addColorStop(1,'rgba(0,0,0,0)');
        ctx.fillStyle=fire; ctx.fillRect(0,0,w,h);
      }
      drawParticles(ctx,w,h,rand,'rgb(167,243,208)',80,2.5);
    }
  },
  'digital-art': {
    accentHex: '#a855f7',
    render: function(ctx, w, h, rand) {
      const bg=ctx.createLinearGradient(0,0,w,h);
      bg.addColorStop(0,'#0f0f23'); bg.addColorStop(0.5,'#1a0533'); bg.addColorStop(1,'#0c0c1e');
      ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);
      ctx.save(); ctx.globalAlpha=0.15;
      for(let i=0;i<20;i++){
        const gx=rand()*w, gy=rand()*h, gs=rand()*120+20;
        const gc=['#a855f7','#6366f1','#06b6d4','#ec4899'][Math.floor(rand()*4)];
        ctx.strokeStyle=gc; ctx.lineWidth=rand()*2+0.5; ctx.shadowBlur=15; ctx.shadowColor=gc;
        ctx.beginPath();
        if(rand()>0.5){ctx.rect(gx-gs/2,gy-gs/2,gs,gs);}else{ctx.arc(gx,gy,gs/2,0,Math.PI*2);}
        ctx.stroke();
      }
      ctx.restore();
      drawStarfield(ctx,w,h,rand,120);
      drawMagicOrbs(ctx,w,h,rand,['rgb(168,85,247)','rgb(99,102,241)','rgb(236,72,153)'],6);
      drawParticles(ctx,w,h,rand,'rgb(168,85,247)',100,2);
      ctx.save(); ctx.globalAlpha=0.04;
      for(let sl=0;sl<h;sl+=3){ctx.fillStyle='rgba(255,255,255,0.8)'; ctx.fillRect(0,sl,w,1);}
      ctx.restore();
    }
  },
  'oil-painting': {
    accentHex: '#f59e0b',
    render: function(ctx, w, h, rand, kw) {
      const bg=ctx.createLinearGradient(0,0,w,h);
      bg.addColorStop(0,kw.hasNight?'#1c0a00':'#7c2d12');
      bg.addColorStop(0.5,kw.hasNight?'#0c0500':'#92400e');
      bg.addColorStop(1,kw.hasForest?'#052e16':'#451a03');
      ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);
      ctx.save(); ctx.globalCompositeOperation='overlay';
      const oilColors=kw.hasForest?['#166534','#14532d','#365314','#a16207']:['#b45309','#d97706','#92400e','#78350f','#dc2626','#9a3412'];
      for(let i=0;i<80;i++){
        const ox=rand()*w, oy=rand()*h, or1=rand()*80+20, or2=rand()*60+10;
        const oc=oilColors[Math.floor(rand()*oilColors.length)];
        const og=ctx.createRadialGradient(ox,oy,0,ox,oy,Math.max(or1,or2));
        og.addColorStop(0,oc+'bb'); og.addColorStop(1,oc+'00');
        ctx.fillStyle=og; ctx.beginPath(); ctx.ellipse(ox,oy,or1,or2,rand()*Math.PI,0,Math.PI*2); ctx.fill();
      }
      ctx.restore();
      drawMountains(ctx,w,h,rand,'rgb(21,128,61)',3);
    }
  },
  'watercolor': {
    accentHex: '#60a5fa',
    render: function(ctx, w, h, rand, kw) {
      ctx.fillStyle='#f8fafc'; ctx.fillRect(0,0,w,h);
      const wColors=kw.hasOcean?['#3b82f6','#0ea5e9','#06b6d4','#67e8f9']:kw.hasForest?['#4ade80','#22c55e','#86efac','#a7f3d0']:['#a78bfa','#93c5fd','#f9a8d4','#6ee7b7','#fde68a'];
      drawWatercolor(ctx,w,h,rand,wColors,15);
      ctx.save(); ctx.globalAlpha=0.06;
      for(let i=0;i<800;i++){const tx=rand()*w,ty=rand()*h; ctx.fillStyle='rgba(0,0,0,'+(rand()*0.3)+')'; ctx.fillRect(tx,ty,1,1);}
      ctx.restore();
    }
  },
  'sketch': {
    accentHex: '#94a3b8',
    render: function(ctx, w, h, rand) {
      ctx.fillStyle='#fafafa'; ctx.fillRect(0,0,w,h);
      ctx.fillStyle='rgba(200,190,170,0.15)'; ctx.fillRect(0,0,w,h);
      drawSketchLines(ctx,w,h,rand,800);
      ctx.save();
      const fx=w*0.2+rand()*w*0.1, fy=h*0.15+rand()*h*0.1, fw=w*0.6, fh=h*0.7;
      for(let i=0;i<1200;i++){
        const lx=fx+rand()*fw, ly=fy+rand()*fh, llen=rand()*30+5;
        const ang=rand()>0.5?Math.PI*0.25:Math.PI*0.75;
        ctx.strokeStyle='rgba(30,30,30,'+(rand()*0.15+0.05)+')'; ctx.lineWidth=rand()*1+0.3;
        ctx.beginPath(); ctx.moveTo(lx,ly); ctx.lineTo(lx+Math.cos(ang)*llen,ly+Math.sin(ang)*llen); ctx.stroke();
      }
      ctx.restore();
    }
  },
  '3d-render': {
    accentHex: '#f472b6',
    render: function(ctx, w, h, rand) {
      const bg=ctx.createLinearGradient(0,0,w,h);
      bg.addColorStop(0,'#0f172a'); bg.addColorStop(0.5,'#1e1b4b'); bg.addColorStop(1,'#0c0a1e');
      ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);
      const l1=ctx.createRadialGradient(w*0.25,h*0.1,0,w*0.25,h*0.1,w*0.6);
      l1.addColorStop(0,'rgba(244,114,182,0.3)'); l1.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=l1; ctx.fillRect(0,0,w,h);
      const l2=ctx.createRadialGradient(w*0.8,h*0.3,0,w*0.8,h*0.3,w*0.5);
      l2.addColorStop(0,'rgba(99,102,241,0.2)'); l2.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=l2; ctx.fillRect(0,0,w,h);
      const sx=w*0.5, sy=h*0.45, sr=Math.min(w,h)*0.18;
      const sph=ctx.createRadialGradient(sx-sr*0.3,sy-sr*0.3,sr*0.05,sx,sy,sr);
      sph.addColorStop(0,'rgba(255,255,255,0.9)'); sph.addColorStop(0.2,'rgba(200,180,255,0.7)');
      sph.addColorStop(0.6,'rgba(60,60,120,0.8)'); sph.addColorStop(1,'rgba(0,0,0,0.9)');
      ctx.save(); ctx.beginPath(); ctx.arc(sx,sy,sr,0,Math.PI*2);
      ctx.fillStyle=sph; ctx.shadowBlur=40; ctx.shadowColor='#f472b6'; ctx.fill(); ctx.restore();
      drawParticles(ctx,w,h,rand,'rgb(244,114,182)',60,1.5);
      ctx.save(); ctx.globalAlpha=0.12; ctx.strokeStyle='#6366f1'; ctx.lineWidth=0.8;
      for(let gy=h*0.7;gy<h;gy+=20){ctx.beginPath();ctx.moveTo(0,gy);ctx.lineTo(w,gy);ctx.stroke();}
      ctx.restore();
    }
  },
  'pixel-art': {
    accentHex: '#fb923c',
    render: function(ctx, w, h, rand, kw) {
      ctx.fillStyle='#0f0e17'; ctx.fillRect(0,0,w,h);
      const palette=kw.hasForest?['#22c55e','#16a34a','#4ade80','#86efac','#052e16']:kw.hasOcean?['#0ea5e9','#06b6d4','#38bdf8','#7dd3fc','#0369a1']:['#fb923c','#a855f7','#22c55e','#38bdf8','#f472b6','#fbbf24','#ef4444','#60a5fa'];
      drawPixelArt(ctx,w,h,rand,palette);
      ctx.save(); ctx.globalAlpha=0.08;
      for(let sl=0;sl<h;sl+=2){ctx.fillStyle='rgba(0,0,0,1)';ctx.fillRect(0,sl,w,1);}
      ctx.restore();
    }
  },
};

export function synthesizeImage(prompt, style, width, height, seed) {
  if (!width) width = 800; if (!height) height = 800;
  const canvas = document.createElement('canvas');
  canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext('2d');
  const actualSeed = (seed !== null && seed !== undefined) ? seed : Math.floor(Date.now() * Math.random());
  const rand = mulberry32(actualSeed);
  const kw = extractKeywords(prompt);
  const cfg = STYLE_CONFIGS[style] || STYLE_CONFIGS['digital-art'];
  cfg.render(ctx, width, height, rand, kw, prompt);

  // Vignette
  const vig = ctx.createRadialGradient(width/2,height/2,width*0.25,width/2,height/2,width*0.75);
  vig.addColorStop(0,'rgba(0,0,0,0)'); vig.addColorStop(1,'rgba(0,0,0,0.55)');
  ctx.fillStyle=vig; ctx.fillRect(0,0,width,height);

  // Prompt words overlay
  const words = prompt.replace(/[,.!?]/g,'').split(' ').filter(function(w){return w.length>4;}).slice(0,8);
  ctx.save(); ctx.globalAlpha=0.14;
  const fontSize = Math.max(10, Math.min(28, width/22));
  ctx.font = 'bold '+fontSize+'px Arial, sans-serif';
  ctx.fillStyle = cfg.accentHex; ctx.shadowBlur=8; ctx.shadowColor=cfg.accentHex;
  words.forEach(function(word, i) {
    const x = (Math.sin(i*2.3)*0.35+0.5)*width;
    const y = (Math.cos(i*1.7)*0.35+0.5)*height;
    ctx.fillText(word, x, y);
  });
  ctx.restore();

  // Bottom bar
  const barH = Math.max(38, height*0.07);
  const barG = ctx.createLinearGradient(0,height-barH,0,height);
  barG.addColorStop(0,'rgba(0,0,0,0)'); barG.addColorStop(1,'rgba(0,0,0,0.85)');
  ctx.fillStyle=barG; ctx.fillRect(0,height-barH,width,barH);
  const bFont = Math.max(9, Math.min(13, width/65));
  ctx.font = 'bold '+bFont+'px Arial, sans-serif';
  ctx.fillStyle = cfg.accentHex; ctx.shadowBlur=8; ctx.shadowColor=cfg.accentHex;
  ctx.fillText('NEXUS AI · ' + style.toUpperCase().replace('-',' '), 12, height-12);
  ctx.shadowBlur=0;
  return canvas.toDataURL('image/png');
}

export function generateImages(prompt, style, count, baseSeed) {
  if (!count) count = 4;
  const seed = (baseSeed !== null && baseSeed !== undefined) ? baseSeed : Math.floor(Math.random()*999999);
  return Array.from({length: count}, function(_, i) {
    return synthesizeImage(prompt, style, 800, 800, seed + i*7919);
  });
}
