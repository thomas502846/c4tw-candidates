import { chromium } from '@playwright/test';
const BASE='http://52.78.36.24';
const browser = await chromium.launch({ args:['--no-sandbox'] });

// HOME: hero translateX changes + news ticker moves
const ctx = await browser.newContext({ viewport:{width:1440,height:900} });
const page = await ctx.newPage();
await page.goto(BASE+'/',{waitUntil:'networkidle',timeout:60000});
const heroTrack = await page.evaluate(()=>{ const t=document.querySelector('[class*="transition-transform"][style*="translateX"]'); return t?t.getAttribute('style'):null; });
// sample hero transform over 9s (interval ~4s)
const heroSamples=[];
for(let i=0;i<10;i++){ const tr=await page.evaluate(()=>{const t=document.querySelector('[style*="translateX"]');return t?getComputedStyle(t).transform:null;}); heroSamples.push(tr); await page.waitForTimeout(1000); }
// news ticker: track DOM key remount (text of first visible row over time)
const newsSamples=[];
const nctx=await page.evaluate(()=>{ const n=document.querySelector('[class*="news"],[class*="News"]'); return n?n.className:null; });
for(let i=0;i<8;i++){ const txt=await page.evaluate(()=>{ const rows=document.querySelectorAll('[style*="news-roll-up"] *, [class*="ticker"] *'); return rows.length; }); newsSamples.push(txt); await page.waitForTimeout(1000); }
await ctx.close();

// ABOUT: ScrollReveal mid-state — capture opacity transitions while slow-scrolling
const ctx2=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'no-preference'});
const page2=await ctx2.newPage();
await page2.goto(BASE+'/about',{waitUntil:'networkidle',timeout:60000});
const reveal=await page2.evaluate(async()=>{
  // ScrollReveal sets opacity/translate; find elements that start hidden
  const all=Array.from(document.querySelectorAll('*')).filter(e=>{const cs=getComputedStyle(e);return cs.transitionProperty.includes('opacity')||cs.transitionProperty.includes('transform')||cs.opacity==='0';});
  const tracked=all.slice(0,60);
  let everHidden=0, sawMid=0, everShown=0;
  const midKeys=new Set();
  for(let s=0;s<20;s++){
    window.scrollBy(0,160);
    await new Promise(r=>setTimeout(r,80));
    tracked.forEach((e,i)=>{ const o=parseFloat(getComputedStyle(e).opacity); if(o===0)everHidden++; if(o>0.03&&o<0.97){midKeys.add(i);} if(o>0.97)everShown++; });
  }
  return { trackedCount:tracked.length, everHidden, midStateElements:midKeys.size, everShown };
});
await ctx2.close();
await browser.close();

const uniqHero=[...new Set(heroSamples)];
console.log(JSON.stringify({
  hero:{ initialStyle:heroTrack, distinctTransforms:uniqHero.length, samples:uniqHero },
  news:{ className:nctx, rowCountsOverTime:newsSamples },
  scrollReveal:reveal
},null,2));
