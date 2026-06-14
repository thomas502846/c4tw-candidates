import { chromium } from '@playwright/test';
const BASE='http://52.78.36.24';
const browser = await chromium.launch({ args:['--no-sandbox'] });

// 1) Re-verify "broken" images truly load (wait for decode), desktop + mobile
async function imgCheck(path, w, h){
  const ctx = await browser.newContext({ viewport:{width:w,height:h} });
  const page = await ctx.newPage();
  await page.goto(BASE+path, { waitUntil:'networkidle', timeout:60000 });
  await page.evaluate(async()=>{ let y=0; while(y<document.body.scrollHeight){window.scrollBy(0,500);y+=500;await new Promise(r=>setTimeout(r,150));} });
  await page.waitForTimeout(1500);
  await page.evaluate(()=>window.scrollTo(0,0));
  // force decode wait
  const res = await page.evaluate(async()=>{
    const list=Array.from(document.images);
    await Promise.all(list.map(im=>im.decode?.().catch(()=>{})));
    let broken=[];
    for(const im of list){ if(im.src && (!im.complete||im.naturalWidth===0)) broken.push((im.currentSrc||im.src).slice(-50)); }
    return { total:list.length, broken };
  });
  await ctx.close();
  return res;
}

// 2) care-768 overflow root cause
async function careOverflow(){
  const ctx = await browser.newContext({ viewport:{width:768,height:1024} });
  const page = await ctx.newPage();
  await page.goto(BASE+'/care',{waitUntil:'networkidle',timeout:60000});
  await page.evaluate(async()=>{ let y=0; while(y<document.body.scrollHeight){window.scrollBy(0,500);y+=500;await new Promise(r=>setTimeout(r,120));} });
  const r = await page.evaluate(()=>{
    const docW=document.documentElement.scrollWidth, vw=window.innerWidth;
    // is the offender inside an overflow-x scroll container?
    const off=document.querySelector('.flex.md\\:w-\\[112\\%\\]');
    let parentOX=null;
    if(off){ let p=off.parentElement; while(p){ const ox=getComputedStyle(p).overflowX; if(ox==='auto'||ox==='scroll'||ox==='hidden'){parentOX=ox;break;} p=p.parentElement; } }
    // also check body overflow-x
    const bodyOX=getComputedStyle(document.body).overflowX;
    return { docW, vw, diff:docW-vw, offenderFound:!!off, parentOverflowX:parentOX, bodyOverflowX:bodyOX, htmlScroll:document.documentElement.scrollWidth, clientW:document.documentElement.clientWidth };
  });
  await ctx.close();
  return r;
}

const out={};
out['home-390']=await imgCheck('/',390,844);
out['care-390']=await imgCheck('/care',390,844);
out['school-1440']=await imgCheck('/school',1440,900);
out['training-1440']=await imgCheck('/training',1440,900);
out['careOverflow768']=await careOverflow();
await browser.close();
console.log(JSON.stringify(out,null,2));
